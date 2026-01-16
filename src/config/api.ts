export const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3001'  // Local development
  : '';                       // Production (same origin)

export const ANTHROPIC_ENDPOINT = `${API_BASE_URL}/api/anthropic/move`;