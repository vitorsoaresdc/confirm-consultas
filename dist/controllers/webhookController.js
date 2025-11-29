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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = handleWebhook;
const pacienteService_1 = require("../services/pacienteService");
const consultaService_1 = require("../services/consultaService");
function normalizeText(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
function isConfirmacao(texto) {
    const textoNormalizado = normalizeText(texto);
    const palavrasConfirmacao = ['sim', 'confirmo', 'ok', 'confirmar', 'yes', 's'];
    return palavrasConfirmacao.some(palavra => textoNormalizado.includes(palavra));
}
function isCancelamento(texto) {
    const textoNormalizado = normalizeText(texto);
    const palavrasCancelamento = ['nao', 'não', 'cancelar', 'cancelo', 'n', 'no'];
    return palavrasCancelamento.some(palavra => textoNormalizado.includes(palavra));
}
function handleWebhook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            console.log('[Webhook] Recebida mensagem:', JSON.stringify(req.body, null, 2));
            const { from, body, text, message } = req.body;
            let mensagemTexto = body || text || (message === null || message === void 0 ? void 0 : message.conversation) || ((_a = message === null || message === void 0 ? void 0 : message.extendedTextMessage) === null || _a === void 0 ? void 0 : _a.text);
            if (!mensagemTexto || !from) {
                console.warn('[Webhook] Mensagem sem texto ou remetente');
                return res.status(200).json({ success: true, message: 'Ignorado' });
            }
            const telefone = from.replace(/\D/g, '');
            const telefoneFormatado = telefone.startsWith('55') ? telefone : `55${telefone}`;
            const paciente = yield (0, pacienteService_1.getPacienteByTelefone)(telefoneFormatado);
            if (!paciente) {
                console.log(`[Webhook] Paciente não encontrado para o telefone: ${telefoneFormatado}`);
                return res.status(200).json({ success: true, message: 'Paciente não encontrado' });
            }
            const consulta = yield (0, consultaService_1.getProximaConsultaEnviadaPorPaciente)(paciente.id);
            if (!consulta) {
                console.log(`[Webhook] Nenhuma consulta "enviada" encontrada para o paciente ${paciente.nome}`);
                return res.status(200).json({ success: true, message: 'Sem consulta pendente' });
            }
            if (isConfirmacao(mensagemTexto)) {
                yield (0, consultaService_1.updateConsultaStatus)(consulta.id, 'confirmada');
                console.log(`[Webhook] ✅ Consulta ${consulta.id} CONFIRMADA por ${paciente.nome}`);
                return res.status(200).json({ success: true, message: 'Consulta confirmada' });
            }
            else if (isCancelamento(mensagemTexto)) {
                yield (0, consultaService_1.updateConsultaStatus)(consulta.id, 'cancelada');
                console.log(`[Webhook] ❌ Consulta ${consulta.id} CANCELADA por ${paciente.nome}`);
                console.log(`[Notificação] Psicóloga deve ser notificada sobre cancelamento de ${paciente.nome}`);
                return res.status(200).json({ success: true, message: 'Consulta cancelada' });
            }
            else {
                console.log(`[Webhook] Mensagem não reconhecida de ${paciente.nome}: "${mensagemTexto}"`);
                return res.status(200).json({ success: true, message: 'Mensagem não reconhecida' });
            }
        }
        catch (error) {
            console.error('[Webhook] Erro ao processar webhook:', error.message);
            return res.status(200).json({ success: false, error: error.message });
        }
    });
}
