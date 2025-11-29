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
exports.startEnviarConfirmacoesJob = startEnviarConfirmacoesJob;
const node_cron_1 = __importDefault(require("node-cron"));
const consultaService_1 = require("../services/consultaService");
const pacienteService_1 = require("../services/pacienteService");
const whatsappService_1 = require("../services/whatsappService");
const dateUtils_1 = require("../utils/dateUtils");
function startEnviarConfirmacoesJob() {
    node_cron_1.default.schedule('*/5 * * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log('[Job] Verificando consultas para envio de confirmação...');
        try {
            const consultasPendentes = yield (0, consultaService_1.getConsultasPendentes)();
            console.log(`[Job] Encontradas ${consultasPendentes.length} consultas pendentes`);
            for (const consulta of consultasPendentes) {
                try {
                    if ((0, dateUtils_1.isWithinThreeHours)(consulta.data_hora)) {
                        const paciente = yield (0, pacienteService_1.getPacienteById)(consulta.paciente_id);
                        if (!paciente) {
                            console.warn(`[Job] Paciente ${consulta.paciente_id} não encontrado`);
                            continue;
                        }
                        if (!paciente.ativo) {
                            console.log(`[Job] Paciente ${paciente.nome} está inativo, pulando envio`);
                            continue;
                        }
                        yield (0, whatsappService_1.sendConfirmation)(paciente, consulta);
                        yield (0, consultaService_1.updateConsultaStatus)(consulta.id, 'enviada');
                        console.log(`[Job] Confirmação enviada para ${paciente.nome} (${paciente.telefone}) - Consulta: ${consulta.data_hora}`);
                    }
                }
                catch (error) {
                    console.error(`[Job] Erro ao processar consulta ${consulta.id}:`, error.message);
                }
            }
            console.log('[Job] Verificação de confirmações concluída');
        }
        catch (error) {
            console.error('[Job] Erro ao executar job de envio de confirmações:', error.message);
        }
    }));
    console.log('[Job] Job de envio de confirmações agendado (a cada 5 minutos)');
}
