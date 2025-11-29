import { supabase } from '../config/supabase';
import { Consulta } from '../types/global';
import { formatDateToISO } from '../utils/dateUtils';

export async function createConsulta(pacienteId: string, dataHora: Date): Promise<Consulta> {
  const { data: consulta, error } = await supabase
    .from('consultas')
    .insert({
      paciente_id: pacienteId,
      data_hora: formatDateToISO(dataHora),
      status: 'pendente',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar consulta: ${error.message}`);
  }

  return consulta;
}

export async function getAllConsultas(): Promise<Consulta[]> {
  const { data, error } = await supabase
    .from('consultas')
    .select('*')
    .order('data_hora', { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar consultas: ${error.message}`);
  }

  return data || [];
}

export async function getConsultasPendentes(): Promise<Consulta[]> {
  const { data, error } = await supabase
    .from('consultas')
    .select('*')
    .eq('status', 'pendente')
    .order('data_hora', { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar consultas pendentes: ${error.message}`);
  }

  return data || [];
}

export async function updateConsultaStatus(
  consultaId: string,
  status: 'pendente' | 'enviada' | 'confirmada' | 'cancelada'
): Promise<Consulta> {
  const { data: consulta, error } = await supabase
    .from('consultas')
    .update({ status })
    .eq('id', consultaId)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar status da consulta: ${error.message}`);
  }

  return consulta;
}

export async function getProximaConsultaEnviadaPorPaciente(pacienteId: string): Promise<Consulta | null> {
  const now = new Date();

  const { data, error } = await supabase
    .from('consultas')
    .select('*')
    .eq('paciente_id', pacienteId)
    .eq('status', 'enviada')
    .gte('data_hora', now.toISOString())
    .order('data_hora', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Erro ao buscar consulta enviada: ${error.message}`);
  }

  return data;
}

export async function verificarConsultaDuplicada(pacienteId: string, dataHora: Date): Promise<boolean> {
  const { data, error } = await supabase
    .from('consultas')
    .select('id')
    .eq('paciente_id', pacienteId)
    .eq('data_hora', formatDateToISO(dataHora))
    .limit(1);

  if (error) {
    throw new Error(`Erro ao verificar duplicata: ${error.message}`);
  }

  return (data?.length || 0) > 0;
}

