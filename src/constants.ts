
import { Model } from './types';

export const AVAILABLE_MODELS: Model[] = [
  // Gemini Models
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', family: 'gemini', provider: 'google' },
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Preview)', family: 'gemini', provider: 'google' },
  { id: 'gemini-pro-latest', name: 'Gemini Pro', family: 'gemini', provider: 'google' },
  // OpenAI Models
  { id: 'gpt-4o', name: 'ChatGPT 4o', family: 'openai', provider: 'OpenAI' },
  { id: 'gpt-4o-mini', name: 'ChatGPT 4o Mini', family: 'openai', provider: 'OpenAI' },
  { id: 'gpt-3.5-turbo', name: 'ChatGPT 3.5 Turbo', family: 'openai', provider: 'OpenAI' },
  // Anthropic Models
  { id: 'claude-opus-4-5-20251101', name: 'Claude 3 Opus (High)', family: 'anthropic', provider: 'Anthropic' },
  { id: 'claude-sonnet-4-5-20250929', name: 'Claude 4.5 Sonnet (Med)', family: 'anthropic', provider: 'Anthropic'  },
  { id: 'claude-haiku-4-5-20251001', name: 'Claude 4.5 Haiku (Low)', family: 'anthropic', provider: 'Anthropic'  },
  // DeepSeek Models
  { id: 'deepseek-chat', name: 'DeepSeek-V2 Lite', family: 'deepseek', provider: 'China'  },
  // Mistral Models
  { id: 'mistral-large-latest', name: 'Mistral Large', family: 'mistral', provider: 'Mistral'  },
  { id: 'open-mixtral-8x7b', name: 'Mixtral 8x7B', family: 'mistral', provider: 'Mistral'  },
  // IBM Models
  { id: 'ibm/granite-13b-chat-v2', name: 'IBM Granite 13B', family: 'ibm', provider: 'IBM'  },
];
