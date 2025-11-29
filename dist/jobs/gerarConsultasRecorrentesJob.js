import cron from 'node-cron';
import { getRecorrenciasAtivas, updateProximaConsulta } from '../services/recorrenciaService.js';
import { createConsulta, verificarConsultaDuplicada } from '../services/consultaService.js';
import { getNextOccurrence } from '../utils/dateUtils.js';
export function startGerarConsultasRecorrentesJob() {
    cron.schedule('5 0 * * *', async () => {
        console.log('[Job] Iniciando geração de consultas recorrentes...');
        try {
            const recorrencias = await getRecorrenciasAtivas();
            console.log(`[Job] Encontradas ${recorrencias.length} recorrências ativas`);
            for (const recorrencia of recorrencias) {
                try {
                    const proximaConsultaDate = new Date(recorrencia.proxima_consulta);
                    const hoje = new Date();
                    hoje.setHours(0, 0, 0, 0);
                    if (proximaConsultaDate <= hoje) {
                        const jaExiste = await verificarConsultaDuplicada(recorrencia.paciente_id, proximaConsultaDate);
                        if (!jaExiste) {
                            await createConsulta(recorrencia.paciente_id, proximaConsultaDate);
                            console.log(`[Job] Consulta criada para paciente ${recorrencia.paciente_id} em ${proximaConsultaDate.toISOString()}`);
                        }
                        else {
                            console.log(`[Job] Consulta duplicada detectada, pulando para paciente ${recorrencia.paciente_id}`);
                        }
                        const novaProximaConsulta = getNextOccurrence(recorrencia.tipo, proximaConsultaDate);
                        await updateProximaConsulta(recorrencia.id, novaProximaConsulta);
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
    });
    console.log('[Job] Job de geração de consultas recorrentes agendado (todo dia às 00:05)');
}
