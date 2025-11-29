import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { startEnviarConfirmacoesJob } from './jobs/enviarConfirmacoesJob';
import { startGerarConsultasRecorrentesJob } from './jobs/gerarConsultasRecorrentesJob';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Endpoints disponíveis:`);
  console.log(`   POST   /pacientes`);
  console.log(`   GET    /pacientes`);
  console.log(`   POST   /recorrencias`);
  console.log(`   GET    /recorrencias`);
  console.log(`   GET    /consultas`);
  console.log(`   PATCH  /consultas/:id/status`);
  console.log(`   POST   /webhook/whatsapp`);
  console.log();

  console.log('⏰ Iniciando cron jobs...');
  startEnviarConfirmacoesJob();
  startGerarConsultasRecorrentesJob();
  console.log('✅ Sistema de confirmação de consultas iniciado!\n');
});

