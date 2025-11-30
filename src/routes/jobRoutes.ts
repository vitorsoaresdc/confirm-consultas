import { Router } from 'express';
import { executarEnviarConfirmacoesJob } from '../jobs/enviarConfirmacoesJob.js';
import { executarGerarConsultasRecorrentesJob } from '../jobs/gerarConsultasRecorrentesJob.js';

const router = Router();

// Endpoint para ser chamado pelo console.cron-job.org
router.post('/enviar-confirmacoes', async (req, res) => {
  try {
    await executarEnviarConfirmacoesJob();
    res.status(200).json({ success: true, message: 'Job de envio de confirmações executado com sucesso' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/gerar-consultas-recorrentes', async (req, res) => {
  try {
    await executarGerarConsultasRecorrentesJob();
    res.status(200).json({ success: true, message: 'Job de geração de consultas recorrentes executado com sucesso' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

