import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // <- importar cors

const app = express();

// Permitir todas as origens (dev)
app.use(cors()); // <- ADICIONE ISSO
app.use(express.json());

const GOOGLE_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbzbYphCnzGBKdvYIZa6z301S7vzc2e2WNRpogFKdyoW4rg16zeAR0jN-cr6fNbuWoJn/exec';

app.post('/sync', async (req, res) => {
  try {
    const bodyToSend = {
      caixas: Array.isArray(req.body.caixas) ? req.body.caixas : [],
      pontas: Array.isArray(req.body.pontas) ? req.body.pontas : [],
    };

    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyToSend),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { status: 'erro', message: 'Google retornou HTML ou não JSON' };
    }

    res.json(data);
  } catch (err) {
    console.error('Erro real:', err);
    res.status(500).json({ error: 'Falha ao sincronizar com Google Sheets' });
  }
});

app.get('/sync', async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SHEETS_URL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dados do Sheets' });
  }
});

app.listen(3000, () => console.log('Backend rodando na porta 3000'));
