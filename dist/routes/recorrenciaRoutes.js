import { Router } from 'express';
import { criarRecorrencia, listarRecorrencias, atualizarRecorrencia, excluirRecorrencia } from '../controllers/recorrenciaController.js';
const router = Router();
router.post('/', criarRecorrencia);
router.get('/', listarRecorrencias);
router.put('/:id', atualizarRecorrencia);
router.delete('/:id', excluirRecorrencia);
export default router;
