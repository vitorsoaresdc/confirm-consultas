import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

// Descoberta simples do diretório estático
const candidateStaticPaths = [
  path.join(__dirname, 'static'),
  path.join(process.cwd(), 'dist', 'static'),
];

let staticPath: string | null = null;
let indexPath: string | null = null;

for (const p of candidateStaticPaths) {
  const idx = path.join(p, 'index.html');
  if (existsSync(idx)) {
    staticPath = p;
    indexPath = idx;
    break;
  }
}

if (staticPath && indexPath) {
  app.use(express.static(staticPath));
  console.log(`Servindo arquivos estáticos de: ${staticPath}`);
} else {
  console.error('Frontend não encontrado. Verifique se o build copiou os arquivos para dist/static.');
}

app.get('*', (req, res) => {
  if (indexPath && existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ success: false, error: 'Frontend não encontrado' });
  }
});

export default app;
