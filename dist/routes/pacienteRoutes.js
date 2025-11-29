import { Router } from 'express';
import { criarPaciente, listarPacientes, atualizarPaciente, excluirPaciente } from '../controllers/pacienteController.js';
const router = Router();
router.post('/', criarPaciente);
router.get('/', listarPacientes);
router.put('/:id', atualizarPaciente);
router.delete('/:id', excluirPaciente);
export default router;
