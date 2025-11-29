import { Request, Response } from 'express';
import { z } from 'zod';
import { createPaciente, getAllPacientes } from '../services/pacienteService';

const createPacienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  telefone: z.string().regex(/^\+?55\d{10,11}$/, 'Telefone deve estar no formato +55DDDXXXXXXXXX'),
});

export async function criarPaciente(req: Request, res: Response) {
  try {
    const validatedData = createPacienteSchema.parse(req.body);
    const paciente = await createPaciente(validatedData);

    return res.status(201).json({
      success: true,
      data: paciente,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export async function listarPacientes(req: Request, res: Response) {
  try {
    const pacientes = await getAllPacientes();

    return res.status(200).json({
      success: true,
      data: pacientes,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
