import axios from 'axios';
import { whappiConfig } from '../config/whappi.js';
import { formatTime } from '../utils/dateUtils.js';
export async function sendMessage(numero, texto) {
    try {
        const numeroLimpo = numero.replace(/\D/g, '');
        const numeroFormatado = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;
        const url = `${whappiConfig.baseUrl}messages/text`;
        const payload = {
            to: numeroFormatado,
            body: texto,
        };
        console.log(`[WhatsApp] Enviando mensagem para ${numeroFormatado}...`);
        const response = await axios.post(url, payload, {
            headers: whappiConfig.headers,
        });
        console.log(`[WhatsApp] Mensagem enviada com sucesso:`, response.data);
    }
    catch (error) {
        console.error('[WhatsApp] Erro ao enviar mensagem:', error.response?.data || error.message);
        throw new Error(`Falha ao enviar mensagem WhatsApp: ${error.message}`);
    }
}
export async function sendConfirmation(paciente, consulta) {
    const dataHora = new Date(consulta.data_hora);
    const hora = formatTime(dataHora);
    const mensagem = `Olá, ${paciente.nome}! Sua sessão com a Dra. será hoje às ${hora}. Pode confirmar? Responda SIM ou NÃO.`;
    await sendMessage(paciente.telefone, mensagem);
}
