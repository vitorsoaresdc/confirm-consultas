import { supabase } from '../config/supabase.js';
import { formatDateToISO } from '../utils/dateUtils.js';
export async function createRecorrencia(data) {
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
export async function getAllRecorrencias() {
    const { data, error } = await supabase
        .from('recorrencias')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        throw new Error(`Erro ao buscar recorrências: ${error.message}`);
    }
    return data || [];
}
export async function getRecorrenciasAtivas() {
    const { data, error } = await supabase
        .from('recorrencias')
        .select('*')
        .eq('ativo', true);
    if (error) {
        throw new Error(`Erro ao buscar recorrências ativas: ${error.message}`);
    }
    return data || [];
}
export async function updateProximaConsulta(recorrenciaId, novaData) {
    const { error } = await supabase
        .from('recorrencias')
        .update({ proxima_consulta: formatDateToISO(novaData) })
        .eq('id', recorrenciaId);
    if (error) {
        throw new Error(`Erro ao atualizar próxima consulta: ${error.message}`);
    }
}
export async function updateRecorrencia(id, data) {
    const { data: recorrencia, error } = await supabase
        .from('recorrencias')
        .update(data)
        .eq('id', id)
        .select()
        .single();
    if (error) {
        throw new Error(`Erro ao atualizar recorrência: ${error.message}`);
    }
    return recorrencia;
}
export async function deleteRecorrencia(id) {
    const { error } = await supabase
        .from('recorrencias')
        .delete()
        .eq('id', id);
    if (error) {
        throw new Error(`Erro ao deletar recorrência: ${error.message}`);
    }
}
