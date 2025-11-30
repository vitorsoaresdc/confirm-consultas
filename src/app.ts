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

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes (prefixadas com /api)
app.use('/api', routes);

// Servir arquivos estáticos (HTML, CSS, JS)
const staticPath = path.join(__dirname, 'static');
const indexPath = path.join(staticPath, 'index.html');

console.log('📁 __dirname:', __dirname);
console.log('📁 Static path:', staticPath);
console.log('📁 Index.html exists:', existsSync(indexPath));

if (existsSync(staticPath)) {
  app.use(express.static(staticPath));
  console.log('✅ Servindo arquivos estáticos de:', staticPath);
} else {
  console.warn('⚠️ Pasta static não encontrada em:', staticPath);
}

// Todas as outras rotas retornam o index.html (SPA routing)
app.get('*', (req, res) => {
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      success: false,
      error: 'Frontend não encontrado',
      staticPath: staticPath,
      dirname: __dirname
    });
  }
});

export default app;
