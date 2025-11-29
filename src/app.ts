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

// Servir arquivos estáticos do frontend (após o build)
// Em produção: /opt/render/project/src/dist -> /opt/render/project/frontend/dist
// Em dev: /Users/.../confirm-consultas/dist -> /Users/.../confirm-consultas/frontend/dist
const frontendPath = path.resolve(__dirname, '..', 'frontend', 'dist');
const indexPath = path.join(frontendPath, 'index.html');

// Log do caminho para debug
console.log('📁 __dirname:', __dirname);
console.log('📁 Frontend path:', frontendPath);
console.log('📁 Index.html path:', indexPath);
console.log('📁 Index.html exists:', existsSync(indexPath));

if (existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  console.log('✅ Servindo frontend estático de:', frontendPath);
} else {
  console.warn('⚠️ Frontend dist não encontrado em:', frontendPath);
}

// Todas as outras rotas retornam o index.html do React (SPA routing)
app.get('*', (req, res) => {
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      success: false,
      error: 'Frontend não encontrado',
      path: frontendPath
    });
  }
});

export default app;
