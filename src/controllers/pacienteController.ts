import { Request, Response } from 'express';
import { z } from 'zod';
import { createPaciente, getAllPacientes, updatePaciente, deletePaciente } from '../services/pacienteService.js';

const createPacienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  telefone: z.string().min(8, 'Telefone inválido'),
});

function normalizeTelefone(input: string): string {
  const onlyDigits = (input || '').replace(/\D/g, '');
  const withCountry = onlyDigits.startsWith('55') ? onlyDigits : `55${onlyDigits}`;
  const sliced = withCountry.slice(0, 13);
  return `+${sliced}`;
}

export async function criarPaciente(req: Request, res: Response) {
  try {
    const validatedData = createPacienteSchema.parse(req.body);
    const telefoneNormalizado = normalizeTelefone(validatedData.telefone);

    const telefoneOk = /^\+55\d{10,11}$/.test(telefoneNormalizado);
    if (!telefoneOk) {
      return res.status(400).json({ success: false, error: 'Telefone deve estar no formato +55DDDXXXXXXXXX' });
    }

    const paciente = await createPaciente({
      nome: validatedData.nome.trim(),
      telefone: telefoneNormalizado,
    });

    return res.status(201).json({ success: true, data: paciente });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Dados inválidos', details: error.errors });
    }

    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function listarPacientes(req: Request, res: Response) {
  try {
    const pacientes = await getAllPacientes();
    return res.status(200).json({ success: true, data: pacientes });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function atualizarPaciente(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = createPacienteSchema.parse(req.body);
    const telefoneNormalizado = normalizeTelefone(validatedData.telefone);

    const telefoneOk = /^\+55\d{10,11}$/.test(telefoneNormalizado);
    if (!telefoneOk) {
      return res.status(400).json({ success: false, error: 'Telefone deve estar no formato +55DDDXXXXXXXXX' });
    }

    const paciente = await updatePaciente(id, {
      nome: validatedData.nome.trim(),
      telefone: telefoneNormalizado,
    });

    return res.status(200).json({ success: true, data: paciente });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Dados inválidos', details: error.errors });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function excluirPaciente(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deletePaciente(id);
    return res.status(200).json({ success: true, message: 'Paciente excluído com sucesso' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
