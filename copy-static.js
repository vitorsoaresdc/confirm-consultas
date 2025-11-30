import { cpSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const source = join(__dirname, 'src', 'static');
const destination = join(__dirname, 'dist', 'static');

console.log('📦 Copiando arquivos estáticos...');
console.log('De:', source);
console.log('Para:', destination);

if (!existsSync(source)) {
  console.error('❌ Pasta src/static não encontrada!');
  console.error('Caminho procurado:', source);
  process.exit(1);
}

try {
  cpSync(source, destination, { recursive: true, force: true });
  console.log('✅ Arquivos estáticos copiados com sucesso!');

  // Verificar se foi copiado
  if (existsSync(join(destination, 'index.html'))) {
    console.log('✅ Verificação: index.html encontrado em dist/static/');
  } else {
    console.error('❌ Verificação falhou: index.html não encontrado');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Erro ao copiar arquivos:', error);
  process.exit(1);
}

