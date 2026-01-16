
import { Piece } from 'chess.js';

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface ChessPiece extends Piece {
  type: PieceType;
  color: PieceColor;
}

export interface GameStatus {
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isStalemate: boolean;
  isThreefoldRepetition: boolean;
  isInsufficientMaterial: boolean;
  isGameOver: boolean;
  message: string;
}

export type GeminiModelId = 'gemini-2.5-pro' | 'gemini-3-flash-preview' | 'gemini-pro-latest';
export type OpenAiModelId = 'gpt-4o' | 'gpt-4o-mini' | 'gpt-3.5-turbo';
export type AnthropicModelId = 
  | 'claude-3-opus-20240229' 
  | 'claude-3-5-sonnet-20240620' 
  | 'claude-3.5-haiku-20241022'
  | 'claude-opus-4-5-20251101'   // Added
  | 'claude-sonnet-4-5-20250929' // Added
  | 'claude-haiku-4-5-20251001'; // Added
export type DeepSeekModelId = 'deepseek-chat';
export type MistralModelId = 'mistral-large-latest' | 'open-mixtral-8x7b';
export type IbmModelId = 'ibm/granite-13b-chat-v2';


export type ModelId = GeminiModelId | OpenAiModelId | AnthropicModelId | DeepSeekModelId | MistralModelId | IbmModelId;
export type ModelFamily = 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'mistral' | 'ibm';

export interface Model {
  id: ModelId;
  name: string;
  family: ModelFamily;
  provider: string;
}

export interface AppSettings {
  gemini: string;
  openai: string;
  anthropic: string;
  deepseek: string;
  mistral: string;
  ibm: string;
  ibmProjectId: string;
  ibmRegion: string;
  gameTimeLength: number;
}

export interface CapturedPiecesSet {
  w: ChessPiece[];
  b: ChessPiece[];
}
