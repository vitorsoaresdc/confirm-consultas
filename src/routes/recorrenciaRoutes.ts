import { Router } from 'express';
import { criarRecorrencia, listarRecorrencias } from '../controllers/recorrenciaController';

const router = Router();

router.post('/', criarRecorrencia);
router.get('/', listarRecorrencias);

export default router;

