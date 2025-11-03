// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import admin from 'firebase-admin';
import axios from 'axios';

const app = express();
const port = 3001;

// --- CORS configurado corretamente ---
const allowedOrigins = ['http://localhost:3000']; // frontend
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin não permitida'));
    }
  },
  credentials: true // permite cookies e headers de autenticação
}));

app.use(express.json());
app.use(helmet());

// --- Firebase Admin init ---
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

try {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  console.log('Firebase Admin inicializado ✅');
} catch (e) {
  if (!/already exists/u.test(e.message)) console.error('Firebase init error:', e);
}

const db = admin.firestore();

// --- Middleware para checar token ---
async function checkToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ msg: 'Authorization header inválido' });
    }
    const idToken = parts[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    console.warn('Token verification failed:', err?.message || err);
    return res.status(401).json({ msg: 'Token inválido ou expirado' });
  }
}

// Logging simples
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// --- Rotas ---
app.get('/', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// --- Chart data ---
app.get('/api/chart-data', checkToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const snaps = await db.collection('users').doc(uid).collection('emissions')
      .orderBy('createdAt', 'asc')
      .limit(200)
      .get();

    if (!snaps.empty) {
      const data = snaps.docs.map(d => {
        const doc = d.data();
        const createdAt = doc.createdAt?.toDate?.() || new Date();
        return { mes: createdAt.toISOString(), emissoes: Number(doc.co2e) || 0 };
      });
      return res.json(data);
    }

    // fallback: últimos 6 meses
    const now = new Date();
    const sample = [];
    for (let i = 5; i >= 0; i--) {
      const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
      sample.push({ mes: dt.toISOString(), emissoes: Math.round((100 + Math.random() * 200) * 100) / 100 });
    }
    return res.json(sample);
  } catch (err) {
    console.error('Erro /api/chart-data:', err);
    return res.status(500).json({ msg: 'Erro ao buscar dados' });
  }
});

// --- ROI endpoint ---
app.get('/api/roi/:symbol', checkToken, async (req, res) => {
  try {
    const symbol = String(req.params.symbol || '').toUpperCase().trim();
    if (!symbol) return res.status(400).json({ msg: 'Símbolo obrigatório' });

    const FINNHUB_KEY = process.env.FINNHUB_API_KEY;
    if (!FINNHUB_KEY) return res.status(500).json({ msg: 'Finnhub API key não configurada' });

    const now = Math.floor(Date.now() / 1000);
    const oneYearAgo = now - 365 * 24 * 60 * 60;

    let result;
    try {
      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${oneYearAgo}&to=${now}&token=${FINNHUB_KEY}`;
      const response = await axios.get(url);
      result = response.data;
    } catch (err) {
      return res.status(502).json({ msg: 'Ticker inválido ou dados indisponíveis' });
    }

    if (!result || result.s !== 'ok' || !Array.isArray(result.c) || result.c.length < 2) {
      return res.status(502).json({ msg: 'Dados insuficientes para calcular ROI' });
    }

    const prices = result.c.filter(p => typeof p === 'number');
    if (prices.length < 2) return res.status(502).json({ msg: 'Dados insuficientes' });

    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const roiSimple = ((lastPrice - firstPrice) / firstPrice) * 100;

    const firstDate = new Date(result.t[0] * 1000);
    const lastDate = new Date(result.t[result.t.length - 1] * 1000);
    const years = (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 365.25);
    const rate = parseFloat(process.env.DEFAULT_INTEREST_RATE) / 100 || 0.2;
    const roiAdjusted = ((lastPrice / Math.pow(1 + rate, years) - firstPrice) / firstPrice) * 100;

    return res.json({
      symbol,
      roiSimple: roiSimple.toFixed(2),
      roiAdjusted: roiAdjusted.toFixed(2),
      first: firstPrice,
      last: lastPrice,
      years: years.toFixed(2),
      rate: rate * 100,
      data: prices.reverse(),
    });

  } catch (err) {
    console.error('Erro /api/roi:', err?.message || err);
    return res.status(500).json({ msg: 'Erro interno ao buscar ROI' });
  }
});

// --- OpenAI report ---
app.post('/api/report', checkToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ msg: 'Prompt obrigatório' });
    }

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) return res.status(500).json({ msg: 'OpenAI API key não configurada' });

    const systemMessage = `Você é um assistente técnico conciso que gera:
- Um resumo do problema descrito.
- Sugestões práticas para reduzir emissões e melhorar ROI quando relevante.
- 3 passos acionáveis e estimativa qualitativa de impacto.
Seja direto, linguagem empresarial, texto plano.`;

    const payload = {
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      max_tokens: 900,
      temperature: 0.2
    };

    const openaiRes = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      timeout: 30000
    });

    let reportText = openaiRes?.data?.choices?.[0]?.message?.content || openaiRes?.data?.choices?.[0]?.text;
    if (!reportText) return res.status(502).json({ msg: 'Resposta inválida da OpenAI' });

    // salvar histórico
    try {
      const uid = req.user.uid;
      await db.collection('users').doc(uid).collection('reports').add({
        prompt,
        report: reportText,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (saveErr) {
      console.warn('Não foi possível salvar relatório:', saveErr?.message || saveErr);
    }

    return res.json({ report: reportText });

  } catch (err) {
    console.error('Erro /api/report:', err.response?.data || err.message || err);
    let msg = 'Erro ao gerar relatório via OpenAI';
    if (err.response?.data?.error?.message) msg = err.response.data.error.message;
    return res.status(500).json({ msg });
  }
});

// --- Start server ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
