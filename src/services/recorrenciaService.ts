import { supabase } from '../config/supabase';
import { Recorrencia, CreateRecorrenciaDTO } from '../types/global';
import { getNextDateForDayOfWeek, formatDateToISO } from '../utils/dateUtils';

export async function createRecorrencia(data: CreateRecorrenciaDTO): Promise<Recorrencia> {
  const { data: recorrencia, error } = await supabase
    .from('recorrencias')
    .insert({
      paciente_id: data.paciente_id,
      dia_semana: data.dia_semana,
      hora: data.hora,
      tipo: data.tipo,
      proxima_consulta: data.proxima_consulta,
      ativo: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar recorrência: ${error.message}`);
  }

  return recorrencia;
}

export async function getAllRecorrencias(): Promise<Recorrencia[]> {
  const { data, error } = await supabase
    .from('recorrencias')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar recorrências: ${error.message}`);
  }

  return data || [];
}

export async function getRecorrenciasAtivas(): Promise<Recorrencia[]> {
  const { data, error } = await supabase
    .from('recorrencias')
    .select('*')
    .eq('ativo', true);

  if (error) {
    throw new Error(`Erro ao buscar recorrências ativas: ${error.message}`);
  }

  return data || [];
}

export async function updateProximaConsulta(recorrenciaId: string, novaData: Date): Promise<void> {
  const { error } = await supabase
    .from('recorrencias')
    .update({ proxima_consulta: formatDateToISO(novaData) })
    .eq('id', recorrenciaId);

  if (error) {
    throw new Error(`Erro ao atualizar próxima consulta: ${error.message}`);
  }
}

