import { getPacienteByTelefone } from '../services/pacienteService.js';
import { getProximaConsultaEnviadaPorPaciente, updateConsultaStatus } from '../services/consultaService.js';
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
export async function handleWebhook(req, res) {
    try {
        console.log('[Webhook] Recebida mensagem:', JSON.stringify(req.body, null, 2));
        const { from, body, text, message } = req.body;
        let mensagemTexto = body || text || message?.conversation || message?.extendedTextMessage?.text;
        if (!mensagemTexto || !from) {
            console.warn('[Webhook] Mensagem sem texto ou remetente');
            return res.status(200).json({ success: true, message: 'Ignorado' });
        }
        const telefone = from.replace(/\D/g, '');
        const telefoneFormatado = telefone.startsWith('55') ? telefone : `55${telefone}`;
        const paciente = await getPacienteByTelefone(telefoneFormatado);
        if (!paciente) {
            console.log(`[Webhook] Paciente não encontrado para o telefone: ${telefoneFormatado}`);
            return res.status(200).json({ success: true, message: 'Paciente não encontrado' });
        }
        const consulta = await getProximaConsultaEnviadaPorPaciente(paciente.id);
        if (!consulta) {
            console.log(`[Webhook] Nenhuma consulta "enviada" encontrada para o paciente ${paciente.nome}`);
            return res.status(200).json({ success: true, message: 'Sem consulta pendente' });
        }
        if (isConfirmacao(mensagemTexto)) {
            await updateConsultaStatus(consulta.id, 'confirmada');
            console.log(`[Webhook] ✅ Consulta ${consulta.id} CONFIRMADA por ${paciente.nome}`);
            return res.status(200).json({ success: true, message: 'Consulta confirmada' });
        }
        else if (isCancelamento(mensagemTexto)) {
            await updateConsultaStatus(consulta.id, 'cancelada');
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
}
