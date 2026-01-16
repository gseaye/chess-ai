
import { GoogleGenAI, Type } from '@google/genai';
import { ANTHROPIC_ENDPOINT } from '../config/api';
import { Model, AppSettings } from '../types';

// --- PROMPT ENGINEERING ---
// --- const getSystemPrompt = (playerToMove: string) => `You are a world-class chess engine. Your role is to play a game of chess. It is your turn to move. You are playing as ${playerToMove}. Analyze the position and determine the best possible move. You must return your move in Standard Algebraic Notation (SAN). For pawn promotions, use the format 'e8=Q'. For castling, use 'O-O' or 'O-O-O'. Your response must be a JSON object with a single key "move" and the SAN string as the value. For example: {"move": "Nf3"}. Do not include any other text, explanation, or formatting.`;

const getSystemPrompt = (playerToMove: string, legalMoves: string[]) => `
You are a chess move selector.
You must choose exactly one move from the list below.
You are playing as ${playerToMove}.
LEGAL_MOVES:
${legalMoves.join(", ")}

Return the move in JSON: {"move": "<SAN>"}
Do not output anything else.
`;

// --- GEMINI IMPLEMENTATION ---
const getGeminiMove = async (fen: string, playerToMove: string, model: Model, apiKey: string, legalMoves: string[]): Promise<string> => {
  if (!apiKey) throw new Error('Gemini API Key is not configured. Please set it in the settings panel.');
   // const ai = new GoogleGenAI({ apiKey, vertexai: true });
   const ai = new GoogleGenAI({ apiKey});
  
  const moveResponseSchema = {
    type: Type.OBJECT,
    properties: { move: { type: Type.STRING } },
    required: ['move'],
  };

  const response = await ai.models.generateContent({
    model: model.id,
    contents: [{ role: 'user', parts: [{ text: `FEN: "${fen}".\n${getSystemPrompt(playerToMove, legalMoves)}` }] }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: moveResponseSchema,
      temperature: 0.4,
    },
  });

  const jsonString = (response.text || '').trim();
  if (!jsonString) throw new Error("Received an empty response from the Gemini API.");
  return JSON.parse(jsonString).move;
};

// --- OPENAI-COMPATIBLE IMPLEMENTATION ---
const getOpenAICompatibleMove = async (fen: string, playerToMove: string, model: Model, apiKey: string, endpoint: string, providerName: string, legalMoves: string[]): Promise<string> => {
  if (!apiKey) throw new Error(`${providerName} API Key is not configured. Please set it in the settings panel.`);
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model.id,
      messages: [
        { role: 'system', content: getSystemPrompt(playerToMove, legalMoves) },
        { role: 'user', content: `The current board FEN is: ${fen}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`${providerName} API Error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const move = JSON.parse(data.choices[0].message.content).move;
  if (typeof move !== 'string') throw new Error(`Invalid move format from ${providerName}`);
  return move;
};

// --- IBM IMPLEMENTATION ---
const getIbmMove = async (fen: string, playerToMove: string, model: Model, settings: AppSettings, legalMoves: string[]): Promise<string> => {
  if (!settings.ibm) throw new Error('IBM Cloud API Key is not configured.');
  if (!settings.ibmProjectId) throw new Error('IBM Watsonx Project ID is not configured.');
  if (!settings.ibmRegion) throw new Error('IBM Cloud Region is not configured.');

  const token = settings.ibm;
  const endpoint = `https://${settings.ibmRegion}.ml.cloud.ibm.com/ml/v1-beta/generation/text?version=2023-05-29`;
  
  const prompt = `System: ${getSystemPrompt(playerToMove, legalMoves)}\nUser: The current board FEN is: ${fen}\nAssistant:`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      model_id: model.id,
      input: prompt,
      parameters: {
        decoding_method: "greedy",
        max_new_tokens: 20,
        min_new_tokens: 5,
      },
      project_id: settings.ibmProjectId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`IBM API Error: ${response.statusText} - ${errorData.errors?.[0]?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const textContent = data.results[0].generated_text;
  const jsonMatch = textContent.match(/{[\s\S]*}/);
  if (!jsonMatch) throw new Error('No valid JSON found in IBM response.');
  
  const move = JSON.parse(jsonMatch[0]).move;
  if (typeof move !== 'string') throw new Error('Invalid move format from IBM');
  return move;
};

// --- DISPATCHER ---
export async function getAiMove(
  fen: string,
  turn: 'w' | 'b',
  model: Model,
  appSettings: AppSettings,
  legalMoves: string[]
): Promise<string> {
  const playerToMove = turn === 'w' ? 'White' : 'Black';

  try {
    switch (model.family) {
      case 'gemini':
        return await getGeminiMove(fen, playerToMove, model, appSettings.gemini, legalMoves);
      case 'openai':
        return await getOpenAICompatibleMove(fen, playerToMove, model, appSettings.openai, 'https://api.openai.com/v1/chat/completions', 'OpenAI', legalMoves);
      case 'anthropic':
        if (!appSettings.anthropic) {
          throw new Error('Anthropic API Key is not configured. Please set it in the settings panel.');
        }
        
        const response = await fetch(ANTHROPIC_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': appSettings.anthropic,
          },
          body: JSON.stringify({
            model: model.id,
            fen: fen,
            systemPrompt: getSystemPrompt(playerToMove, legalMoves),
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API Error: ${response.statusText} - ${errorData.error || 'Unknown error'}`);
        }
        
        const data = await response.json();
        const textContent = data.content[0].text;
        const jsonMatch = textContent.match(/{[\s\S]*}/);
        if (!jsonMatch) throw new Error('No valid JSON found in Anthropic response.');
        return JSON.parse(jsonMatch[0]).move;
      case 'deepseek':
        return await getOpenAICompatibleMove(fen, playerToMove, model, appSettings.deepseek, 'https://api.deepseek.com/v1/chat/completions', 'DeepSeek', legalMoves);
      case 'mistral':
        return await getOpenAICompatibleMove(fen, playerToMove, model, appSettings.mistral, 'https://api.mistral.ai/v1/chat/completions', 'Mistral', legalMoves);
      case 'ibm':
        return await getIbmMove(fen, playerToMove, model, appSettings, legalMoves);
      default:
        throw new Error(`Unsupported model family: ${model.family}`);
    }
  } catch (error) {
    console.error(`Error getting move from ${model.name}:`, error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(`An unknown error occurred with the ${model.name} API.`);
  }
}