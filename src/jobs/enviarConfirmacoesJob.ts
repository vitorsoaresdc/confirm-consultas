import { getConsultasPendentes, updateConsultaStatus } from '../services/consultaService.js';
import { getPacienteById } from '../services/pacienteService.js';
import { sendConfirmation } from '../services/whatsappService.js';
import { isWithinThreeHours } from '../utils/dateUtils.js';

export async function executarEnviarConfirmacoesJob() {
  console.log('[Job] Iniciando verificação de consultas para envio de confirmação...');

  try {
    const consultasPendentes = await getConsultasPendentes();
    console.log(`[Job] Encontradas ${consultasPendentes.length} consultas pendentes`);

    for (const consulta of consultasPendentes) {
      try {
        if (isWithinThreeHours(consulta.data_hora)) {
          const paciente = await getPacienteById(consulta.paciente_id);

          if (!paciente) {
            console.warn(`[Job] Paciente ${consulta.paciente_id} não encontrado`);
            continue;
          }

          if (!paciente.ativo) {
            console.log(`[Job] Paciente ${paciente.nome} está inativo, pulando envio`);
            continue;
          }

          await sendConfirmation(paciente, consulta);
          await updateConsultaStatus(consulta.id, 'enviada');

          console.log(`[Job] Confirmação enviada para ${paciente.nome} (${paciente.telefone}) - Consulta: ${consulta.data_hora}`);
        }
      } catch (error: any) {
        console.error(`[Job] Erro ao processar consulta ${consulta.id}:`, error.message);
      }
    }

    console.log('[Job] Verificação de confirmações concluída');
  } catch (error: any) {
    console.error('[Job] Erro ao executar job de envio de confirmações:', error.message);
    throw error;
  }
}
