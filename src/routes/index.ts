import { Router } from 'express';
import pacienteRoutes from './pacienteRoutes';
import recorrenciaRoutes from './recorrenciaRoutes';
import consultaRoutes from './consultaRoutes';
import webhookRoutes from './webhookRoutes';

const router = Router();

router.use('/pacientes', pacienteRoutes);
router.use('/recorrencias', recorrenciaRoutes);
router.use('/consultas', consultaRoutes);
router.use('/webhook', webhookRoutes);

export default router;

