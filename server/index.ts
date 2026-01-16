import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// -----------------------------
// Middleware
// -----------------------------
app.use(cors());
app.use(express.json());

// Minimal request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// -----------------------------
// Health check
// -----------------------------
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// -----------------------------
// API endpoint for Anthropic
// -----------------------------
app.post('/api/anthropic/move', async (req, res) => {
  try {
    const { model, fen, systemPrompt } = req.body;
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) return res.status(401).json({ error: 'API key is required.' });
    if (!model || !fen || !systemPrompt)
      return res.status(400).json({ error: 'Missing required fields: model, fen, or systemPrompt' });

    console.log(`Request to Anthropic with model: ${model}`);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        system: systemPrompt,
        messages: [{ role: 'user', content: `The current board FEN is: ${fen}` }],
        max_tokens: 50,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as any; // <-- fix
      console.error('Anthropic API Error:', errorData);
      return res
        .status(response.status)
        .json({ error: `Anthropic API Error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// -----------------------------
// Serve React frontend
// -----------------------------
const frontendPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendPath));

// SPA fallback for React routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// -----------------------------
// Start server
// -----------------------------
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});