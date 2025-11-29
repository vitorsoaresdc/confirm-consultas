"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const enviarConfirmacoesJob_1 = require("./jobs/enviarConfirmacoesJob");
const gerarConsultasRecorrentesJob_1 = require("./jobs/gerarConsultasRecorrentesJob");
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, () => {
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
    (0, enviarConfirmacoesJob_1.startEnviarConfirmacoesJob)();
    (0, gerarConsultasRecorrentesJob_1.startGerarConsultasRecorrentesJob)();
    console.log('✅ Sistema de confirmação de consultas iniciado!\n');
});
