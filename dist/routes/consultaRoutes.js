import { Router } from 'express';
import { listarConsultas, atualizarStatusConsulta } from '../controllers/consultaController.js';
const router = Router();
router.get('/', listarConsultas);
router.patch('/:id/status', atualizarStatusConsulta);
export default router;
