import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; // <- importar cors

const app = express();

// Permitir todas as origens (dev)
app.use(cors()); // <- ADICIONE ISSO
app.use(express.json());

const GOOGLE_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbyftagADqm-uc5hbx1vRwktBm8WVClxYkBmcberXfZCZyAigVL0HbdjIUJEOaZJvDwU/exec';

app.post('/sync', async (req, res) => {
  try {
    console.log('Recebido do React:', JSON.stringify(req.body, null, 2));

    const bodyToSend = {
      caixas: Array.isArray(req.body.caixas) ? req.body.caixas : [],
      pontas: Array.isArray(req.body.pontas) ? req.body.pontas : [],
    };
    console.log(
      'Body que vai pro Google:',
      JSON.stringify(bodyToSend, null, 2),
    );

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

app.listen(3000, () => console.log('Backend rodando na porta 3000'));
