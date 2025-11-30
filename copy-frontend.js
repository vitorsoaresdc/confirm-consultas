import { cpSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const source = join(__dirname, 'frontend', 'dist');
const destination = join(__dirname, 'dist', 'public');

console.log('📦 Copiando frontend...');
console.log('De:', source);
console.log('Para:', destination);

if (!existsSync(source)) {
  console.error('❌ Pasta frontend/dist não encontrada!');
  process.exit(1);
}

// Criar pasta de destino
mkdirSync(destination, { recursive: true });

// Copiar arquivos
try {
  cpSync(source, destination, { recursive: true });
  console.log('✅ Frontend copiado com sucesso!');
} catch (error) {
  console.error('❌ Erro ao copiar frontend:', error);
  process.exit(1);
}

