import { Request, Response } from 'express';
import { z } from 'zod';
import { createRecorrencia, getAllRecorrencias } from '../services/recorrenciaService';

const createRecorrenciaSchema = z.object({
  paciente_id: z.string().uuid('ID do paciente deve ser um UUID válido'),
  dia_semana: z.number().int().min(0).max(6, 'Dia da semana deve ser entre 0 (domingo) e 6 (sábado)'),
  hora: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora deve estar no formato HH:MM'),
  tipo: z.enum(['semanal', 'quinzenal', 'mensal'], {
    errorMap: () => ({ message: 'Tipo deve ser: semanal, quinzenal ou mensal' }),
  }),
  proxima_consulta: z.string().datetime('Data da próxima consulta deve ser um datetime ISO válido'),
});

export async function criarRecorrencia(req: Request, res: Response) {
  try {
    const validatedData = createRecorrenciaSchema.parse(req.body);
    const recorrencia = await createRecorrencia(validatedData);

    return res.status(201).json({
      success: true,
      data: recorrencia,
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

export async function listarRecorrencias(req: Request, res: Response) {
  try {
    const recorrencias = await getAllRecorrencias();

    return res.status(200).json({
      success: true,
      data: recorrencias,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

