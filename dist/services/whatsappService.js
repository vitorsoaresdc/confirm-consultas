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
exports.sendMessage = sendMessage;
exports.sendConfirmation = sendConfirmation;
const axios_1 = __importDefault(require("axios"));
const whappi_1 = require("../config/whappi");
const dateUtils_1 = require("../utils/dateUtils");
function sendMessage(numero, texto) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const numeroLimpo = numero.replace(/\D/g, '');
            const numeroFormatado = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;
            const url = `${whappi_1.whappiConfig.baseUrl}messages/text`;
            const payload = {
                to: numeroFormatado,
                body: texto,
            };
            console.log(`[WhatsApp] Enviando mensagem para ${numeroFormatado}...`);
            const response = yield axios_1.default.post(url, payload, {
                headers: whappi_1.whappiConfig.headers,
            });
            console.log(`[WhatsApp] Mensagem enviada com sucesso:`, response.data);
        }
        catch (error) {
            console.error('[WhatsApp] Erro ao enviar mensagem:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new Error(`Falha ao enviar mensagem WhatsApp: ${error.message}`);
        }
    });
}
function sendConfirmation(paciente, consulta) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataHora = new Date(consulta.data_hora);
        const hora = (0, dateUtils_1.formatTime)(dataHora);
        const mensagem = `Olá, ${paciente.nome}! Sua sessão com a Dra. será hoje às ${hora}. Pode confirmar? Responda SIM ou NÃO.`;
        yield sendMessage(paciente.telefone, mensagem);
    });
}
