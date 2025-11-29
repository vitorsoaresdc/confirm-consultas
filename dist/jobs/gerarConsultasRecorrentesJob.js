"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGerarConsultasRecorrentesJob = startGerarConsultasRecorrentesJob;
const node_cron_1 = __importDefault(require("node-cron"));
const recorrenciaService_1 = require("../services/recorrenciaService");
const consultaService_1 = require("../services/consultaService");
const dateUtils_1 = require("../utils/dateUtils");
function startGerarConsultasRecorrentesJob() {
    node_cron_1.default.schedule('5 0 * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log('[Job] Iniciando geração de consultas recorrentes...');
        try {
            const recorrencias = yield (0, recorrenciaService_1.getRecorrenciasAtivas)();
            console.log(`[Job] Encontradas ${recorrencias.length} recorrências ativas`);
            for (const recorrencia of recorrencias) {
                try {
                    const proximaConsultaDate = new Date(recorrencia.proxima_consulta);
                    const hoje = new Date();
                    hoje.setHours(0, 0, 0, 0);
                    if (proximaConsultaDate <= hoje) {
                        const jaExiste = yield (0, consultaService_1.verificarConsultaDuplicada)(recorrencia.paciente_id, proximaConsultaDate);
                        if (!jaExiste) {
                            yield (0, consultaService_1.createConsulta)(recorrencia.paciente_id, proximaConsultaDate);
                            console.log(`[Job] Consulta criada para paciente ${recorrencia.paciente_id} em ${proximaConsultaDate.toISOString()}`);
                        }
                        else {
                            console.log(`[Job] Consulta duplicada detectada, pulando para paciente ${recorrencia.paciente_id}`);
                        }
                        const novaProximaConsulta = (0, dateUtils_1.getNextOccurrence)(recorrencia.tipo, proximaConsultaDate);
                        yield (0, recorrenciaService_1.updateProximaConsulta)(recorrencia.id, novaProximaConsulta);
                        console.log(`[Job] Próxima consulta atualizada para ${novaProximaConsulta.toISOString()} (tipo: ${recorrencia.tipo})`);
                    }
                }
                catch (error) {
                    console.error(`[Job] Erro ao processar recorrência ${recorrencia.id}:`, error.message);
                }
            }
            console.log('[Job] Geração de consultas recorrentes concluída');
        }
        catch (error) {
            console.error('[Job] Erro ao executar job de geração de consultas:', error.message);
        }
    }));
    console.log('[Job] Job de geração de consultas recorrentes agendado (todo dia às 00:05)');
}
