import { Router } from 'express';
import pacienteRoutes from './pacienteRoutes.js';
import recorrenciaRoutes from './recorrenciaRoutes.js';
import consultaRoutes from './consultaRoutes.js';
import webhookRoutes from './webhookRoutes.js';
import jobRoutes from './jobRoutes.js';

const router = Router();

router.use('/pacientes', pacienteRoutes);
router.use('/recorrencias', recorrenciaRoutes);
router.use('/consultas', consultaRoutes);
router.use('/webhook', webhookRoutes);
router.use('/jobs', jobRoutes);

export default router;
