
import { GoogleGenAI, Type } from '@google/genai';
import { Model, AppSettings } from '../types';

// --- PROMPT ENGINEERING ---
const getSystemPrompt = (playerToMove: string) => `You are a world-class chess engine. Your role is to play a game of chess. It is your turn to move. You are playing as ${playerToMove}. Analyze the position and determine the best possible move. You must return your move in Standard Algebraic Notation (SAN). For pawn promotions, use the format 'e8=Q'. For castling, use 'O-O' or 'O-O-O'. Your response must be a JSON object with a single key "move" and the SAN string as the value. For example: {"move": "Nf3"}. Do not include any other text, explanation, or formatting.`;

// --- GEMINI IMPLEMENTATION ---
const getGeminiMove = async (fen: string, playerToMove: string, model: Model, apiKey: string): Promise<string> => {
  if (!apiKey) throw new Error('Gemini API Key is not configured. Please set it in the settings panel.');
  const ai = new GoogleGenAI({ apiKey, vertexai: true });
  
  const moveResponseSchema = {
    type: Type.OBJECT,
    properties: { move: { type: Type.STRING } },
    required: ['move'],
  };

  const response = await ai.models.generateContent({
    model: model.id,
    contents: [{ role: 'user', parts: [{ text: `FEN: "${fen}".\n${getSystemPrompt(playerToMove)}` }] }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: moveResponseSchema,
      temperature: 0.4,
    },
  });

// If text is undefined, use empty string
const jsonString = (response.text || '').trim();
  if (!jsonString) throw new Error("Received an empty response from the Gemini API.");
  return JSON.parse(jsonString).move;
};

// --- OPENAI-COMPATIBLE IMPLEMENTATION (for OpenAI, DeepSeek, Mistral) ---
const getOpenAICompatibleMove = async (fen: string, playerToMove: string, model: Model, apiKey: string, endpoint: string, providerName: string): Promise<string> => {
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
        { role: 'system', content: getSystemPrompt(playerToMove) },
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
const getIbmMove = async (fen: string, playerToMove: string, model: Model, settings: AppSettings): Promise<string> => {
  if (!settings.ibm) throw new Error('IBM Cloud API Key is not configured.');
  if (!settings.ibmProjectId) throw new Error('IBM Watsonx Project ID is not configured.');
  if (!settings.ibmRegion) throw new Error('IBM Cloud Region is not configured.');

  // NOTE: In a real-world scenario, you'd fetch an IAM token using the API key.
  // For this client-side app, we'll assume the user might provide a Bearer token directly,
  // or we'll pass the API key as the token, which works for some simple cases but is not robust.
  const token = settings.ibm;

  const endpoint = `https://${settings.ibmRegion}.ml.cloud.ibm.com/ml/v1-beta/generation/text?version=2023-05-29`;
  
  const prompt = `System: ${getSystemPrompt(playerToMove)}\nUser: The current board FEN is: ${fen}\nAssistant:`;

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
export async function getAiMove(fen: string, turn: 'w' | 'b', model: Model, appSettings: AppSettings): Promise<string> {
  const playerToMove = turn === 'w' ? 'White' : 'Black';

  try {
    switch (model.family) {
      case 'gemini':
        return await getGeminiMove(fen, playerToMove, model, appSettings.gemini);
      case 'openai':
        return await getOpenAICompatibleMove(fen, playerToMove, model, appSettings.openai, 'https://api.openai.com/v1/chat/completions', 'OpenAI');
      case 'anthropic':
        
        // Anthropic has a slightly different API structure, so it keeps its own function for now.
        if (!appSettings.anthropic) throw new Error('Anthropic API Key is not configured. Please set it in the settings panel.');

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': appSettings.anthropic,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: model.id,
            system: getSystemPrompt(playerToMove),
            messages: [{ role: 'user', content: `The current board FEN is: ${fen}` }],
            max_tokens: 50,
            temperature: 0.4,
          }),
        });
        
        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Anthropic API Error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
        }
        const data = await response.json();
        const textContent = data.content[0].text;
        const jsonMatch = textContent.match(/{[\s\S]*}/);
        if (!jsonMatch) throw new Error('No valid JSON found in Anthropic response.');
        return JSON.parse(jsonMatch[0]).move;

      case 'deepseek':
        return await getOpenAICompatibleMove(fen, playerToMove, model, appSettings.deepseek, 'https://api.deepseek.com/v1/chat/completions', 'DeepSeek');
      case 'mistral':
        return await getOpenAICompatibleMove(fen, playerToMove, model, appSettings.mistral, 'https://api.mistral.ai/v1/chat/completions', 'Mistral');
      case 'ibm':
        return await getIbmMove(fen, playerToMove, model, appSettings);
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
