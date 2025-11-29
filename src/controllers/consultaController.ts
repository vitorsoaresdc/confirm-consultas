import { Request, Response } from 'express';
import { z } from 'zod';
import { getAllConsultas, updateConsultaStatus } from '../services/consultaService';

const updateStatusSchema = z.object({
  status: z.enum(['pendente', 'enviada', 'confirmada', 'cancelada'], {
    errorMap: () => ({ message: 'Status deve ser: pendente, enviada, confirmada ou cancelada' }),
  }),
});

export async function listarConsultas(req: Request, res: Response) {
  try {
    const consultas = await getAllConsultas();

    return res.status(200).json({
      success: true,
      data: consultas,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export async function atualizarStatusConsulta(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateStatusSchema.parse(req.body);
    const consulta = await updateConsultaStatus(id, validatedData.status);

    return res.status(200).json({
      success: true,
      data: consulta,
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

