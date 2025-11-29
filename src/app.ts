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
// Detecta automaticamente o caminho correto do frontend
let frontendPath: string;

// Tenta múltiplos caminhos possíveis
const possiblePaths = [
  path.join(process.cwd(), 'frontend', 'dist'),           // Caminho normal
  path.join(__dirname, '..', 'frontend', 'dist'),         // Relativo ao dist/
  path.join(__dirname, '..', '..', 'frontend', 'dist'),   // Dois níveis acima
  path.join(process.cwd(), '..', 'frontend', 'dist'),     // Um nível acima do cwd
];

// Encontra o primeiro caminho que existe
frontendPath = possiblePaths.find(p => existsSync(path.join(p, 'index.html'))) || possiblePaths[0];
const indexPath = path.join(frontendPath, 'index.html');

// Log do caminho para debug
console.log('📁 process.cwd():', process.cwd());
console.log('📁 __dirname:', __dirname);
console.log('📁 Caminhos testados:', possiblePaths);
console.log('📁 Frontend path escolhido:', frontendPath);
console.log('📁 Index.html path:', indexPath);
console.log('📁 Index.html exists:', existsSync(indexPath));

if (existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  console.log('✅ Servindo frontend estático de:', frontendPath);
} else {
  console.warn('⚠️ Frontend dist não encontrado em nenhum dos caminhos testados');
}

// Todas as outras rotas retornam o index.html do React (SPA routing)
app.get('*', (req, res) => {
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      success: false,
      error: 'Frontend não encontrado',
      cwd: process.cwd(),
      dirname: __dirname,
      possiblePaths: possiblePaths,
      chosenPath: frontendPath,
      indexExists: existsSync(indexPath)
    });
  }
});

export default app;
