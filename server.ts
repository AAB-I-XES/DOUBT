import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const APPROVED_MATERIALS_CATALOG = [
  'Limits, Continuity & Epsilon-Delta Proofs (MA101 · Abhishek Sharma)',
  'Pointers, Dynamic Memory & Linked Lists in C (CS101 · Munsifa Khan)',
  'Eigenvalues, Diagonalization & Spectral Theorem (MA104 · Abhishek Sharma)',
  'Simple, Damped & Forced Harmonic Oscillations (PH103 · Dr. Paragjyoti)',
  'Boolean Algebra & Karnaugh Map Practice Set (EC102 · Rohan Sen)',
  'Integration by Parts & Trigonometric Substitutions (MA101 · Abhishek Sharma)',
];

interface HistoryTurn {
  role: 'student' | 'assistant';
  text: string;
}

interface AttachmentPayload {
  name: string;
  mimeType: string;
  data: string;
}

interface ResolveRequestBody {
  question?: string;
  subject?: string;
  hintFirst?: boolean;
  history?: HistoryTurn[];
  attachment?: AttachmentPayload | null;
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    subject: {
      type: Type.STRING,
      description:
        'Classified first-year subject (Calculus, Data Structures, Physics, Linear Algebra, Digital Logic, or General).',
    },
    conceptSummary: {
      type: Type.STRING,
      description:
        'A concise 2-3 sentence intuitive overview of the underlying concept in plain, encouraging academic prose. Use $...$ for inline LaTeX math when appropriate.',
    },
    steps: {
      type: Type.ARRAY,
      description: 'Ordered step-by-step pedagogical walkthrough of the solution or guided hints.',
      items: {
        type: Type.OBJECT,
        properties: {
          heading: {
            type: Type.STRING,
            description: 'Short, clear step title.',
          },
          explanation: {
            type: Type.STRING,
            description:
              'Clear explanation for this step. Use $...$ for inline LaTeX math and backticks for code.',
          },
          math: {
            type: Type.STRING,
            description:
              'Optional standalone LaTeX equation (without $$ delimiters) if helpful for this step.',
          },
        },
        required: ['heading', 'explanation'],
      },
    },
    commonPitfall: {
      type: Type.STRING,
      description:
        'One concrete mistake first-year students commonly make on this topic and how to avoid it.',
    },
    citedSources: {
      type: Type.ARRAY,
      description:
        '1 to 2 matching titles from the Approved Course Materials catalog that support this explanation.',
      items: {
        type: Type.STRING,
      },
    },
    practiceQuestion: {
      type: Type.OBJECT,
      description: 'One short follow-up practice problem so the student can test understanding.',
      properties: {
        prompt: {
          type: Type.STRING,
          description: 'Short practice problem statement using $...$ for math if needed.',
        },
        hint: {
          type: Type.STRING,
          description: 'Helpful 1-sentence hint for solving the practice problem.',
        },
      },
      required: ['prompt', 'hint'],
    },
    followUpPrompts: {
      type: Type.ARRAY,
      description: 'Three natural, concise follow-up questions the student might ask next.',
      items: {
        type: Type.STRING,
      },
    },
  },
  required: [
    'subject',
    'conceptSummary',
    'steps',
    'commonPitfall',
    'citedSources',
    'practiceQuestion',
    'followUpPrompts',
  ],
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, app: 'DoubtBridge' });
  });

  app.post('/api/ai/resolve', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error:
            'GEMINI_API_KEY is not configured. Please add your API key in Settings > Secrets.',
        });
        return;
      }

      const body = req.body as ResolveRequestBody;
      const question = (body.question || '').trim();
      const subject = (body.subject || 'General').trim();
      const hintFirst = Boolean(body.hintFirst);
      const history = Array.isArray(body.history) ? body.history : [];
      const attachment = body.attachment || null;

      if (!question && !attachment) {
        res.status(400).json({ error: 'Please enter a question or attach an image or PDF.' });
        return;
      }

      const historyContext =
        history.length > 0
          ? `\n\nPrior conversation context:\n${history
              .slice(-6)
              .map((h) => `${h.role === 'student' ? 'Student' : 'Assistant'}: ${h.text}`)
              .join('\n')}`
          : '';

      const pedagogicalMode = hintFirst
        ? 'HINT-FIRST MODE ENABLED: Guide the student with Socratic hints and intermediate milestones rather than giving away the final numeric/code answer immediately, so they can solve the last step themselves.'
        : 'STANDARD STEP-BY-STEP MODE: Provide a clear, rigorous step-by-step explanation grounded in the syllabus.';

      const promptText = `Subject context: ${subject}
Mode: ${pedagogicalMode}
Approved Course Materials Catalog (cite the closest 1-2 matches in citedSources):
- ${APPROVED_MATERIALS_CATALOG.join('\n- ')}

Student question: ${
        question ||
        'Please examine the attached document or image and explain how to solve it step by step.'
      }${historyContext}`;

      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

      if (attachment?.data && attachment?.mimeType) {
        parts.push({
          inlineData: {
            mimeType: attachment.mimeType,
            data: attachment.data,
          },
        });
      }

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: { parts },
        config: {
          systemInstruction:
            'You are DoubtBridge AI, a calm, authoritative university teaching assistant for first-year students at Assam Skill University. Classify the topic, retrieve and cite matching approved course materials from the provided catalog, explain concepts clearly with standard LaTeX ($...$ for inline math, pure LaTeX without $$ inside the `math` field), include a short practice question, and avoid fabricated facts.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      });

      const rawText = (response.text || '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'Empty response received from Gemini API.' });
        return;
      }

      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      const status = typeof errorObj?.status === 'number' ? errorObj.status : 500;
      const message = errorObj?.message || 'Failed to resolve doubt with Gemini API.';
      console.error('Gemini API error:', err);
      res.status(status).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DoubtBridge server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
