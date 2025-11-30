import { cpSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const source = join(__dirname, 'src', 'static');
const destination = join(__dirname, 'dist', 'static');

console.log('\n📦 Iniciando cópia de arquivos estáticos...');
console.log('🔍 Diretório atual:', __dirname);
console.log('📂 Origem:', source);
console.log('📂 Destino:', destination);

// Verificar se origem existe
if (!existsSync(source)) {
  console.error('\n❌ ERRO: Pasta src/static não encontrada!');
  console.error('Caminho procurado:', source);
  console.error('Conteúdo do diretório atual:');
  try {
    console.error(readdirSync(__dirname));
  } catch (e) {
    console.error('Não foi possível listar o diretório');
  }
  process.exit(1);
}

// Listar conteúdo da origem
console.log('\n📋 Conteúdo de src/static:');
try {
  const files = readdirSync(source, { withFileTypes: true });
  files.forEach(file => {
    console.log(`  ${file.isDirectory() ? '📁' : '📄'} ${file.name}`);
  });
} catch (e) {
  console.error('Erro ao listar conteúdo:', e.message);
}

// Copiar arquivos
console.log('\n🔄 Copiando arquivos...');
try {
  cpSync(source, destination, { recursive: true, force: true });
  console.log('✅ Cópia concluída!');
} catch (error) {
  console.error('\n❌ Erro ao copiar arquivos:', error.message);
  process.exit(1);
}

// Verificar se foi copiado corretamente
console.log('\n🔍 Verificando cópia...');
const indexPath = join(destination, 'index.html');
const jsPath = join(destination, 'js');

if (existsSync(indexPath)) {
  console.log('✅ index.html encontrado');
} else {
  console.error('❌ index.html NÃO encontrado em:', indexPath);
  process.exit(1);
}

if (existsSync(jsPath)) {
  console.log('✅ Pasta js/ encontrada');
  const jsFiles = readdirSync(jsPath);
  console.log('   Arquivos JS:', jsFiles.join(', '));
} else {
  console.error('❌ Pasta js/ NÃO encontrada');
  process.exit(1);
}

// Listar conteúdo final do destino
console.log('\n📋 Estrutura final de dist/static:');
try {
  const destFiles = readdirSync(destination, { withFileTypes: true });
  destFiles.forEach(file => {
    console.log(`  ${file.isDirectory() ? '📁' : '📄'} ${file.name}`);
  });
} catch (e) {
  console.error('Erro ao listar destino:', e.message);
}

console.log('\n✅ Arquivos estáticos copiados com sucesso!\n');


