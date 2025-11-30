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
// Tentar múltiplos caminhos possíveis
const possiblePaths = [
  path.join(__dirname, 'static'),                    // dist/static (produção)
  path.join(__dirname, '..', 'src', 'static'),       // src/static (se executado de dist/)
  path.join(__dirname, '..', 'static'),              // ../static
  path.join(process.cwd(), 'dist', 'static'),        // cwd/dist/static
  path.join(process.cwd(), 'src', 'static'),         // cwd/src/static
];

console.log('\n🔍 Procurando arquivos estáticos...');
console.log('📁 __dirname:', __dirname);
console.log('📁 process.cwd():', process.cwd());
console.log('\n📂 Caminhos testados:');

let staticPath: string | null = null;
let indexPath: string | null = null;

for (const testPath of possiblePaths) {
  const testIndex = path.join(testPath, 'index.html');
  console.log(`  ${existsSync(testIndex) ? '✅' : '❌'} ${testPath}`);

  if (existsSync(testIndex) && !staticPath) {
    staticPath = testPath;
    indexPath = testIndex;
  }
}

if (!staticPath || !indexPath) {
  console.error('\n❌ ERRO: Frontend não encontrado em nenhum dos caminhos!');
  console.error('Isso pode indicar que o build não copiou os arquivos corretamente.');
} else {
  console.log(`\n✅ Frontend encontrado em: ${staticPath}`);
  app.use(express.static(staticPath));
  console.log('✅ Servindo arquivos estáticos\n');
}

// Todas as outras rotas retornam o index.html (SPA routing)
app.get('*', (req, res) => {
  if (indexPath && existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      success: false,
      error: 'Frontend não encontrado',
      dirname: __dirname,
      cwd: process.cwd(),
      possiblePaths: possiblePaths,
      checkedPaths: possiblePaths.map(p => ({
        path: p,
        exists: existsSync(path.join(p, 'index.html'))
      }))
    });
  }
});

export default app;
