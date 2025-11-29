import { supabase } from '../config/supabase.js';
export async function createPaciente(data) {
    const { data: paciente, error } = await supabase
        .from('pacientes')
        .insert({
        nome: data.nome,
        telefone: data.telefone,
        ativo: true,
    })
        .select()
        .single();
    if (error) {
        throw new Error(`Erro ao criar paciente: ${error.message}`);
    }
    return paciente;
}
export async function getAllPacientes() {
    const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        throw new Error(`Erro ao buscar pacientes: ${error.message}`);
    }
    return data || [];
}
export async function getPacienteById(id) {
    const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        throw new Error(`Erro ao buscar paciente: ${error.message}`);
    }
    return data;
}
export async function getPacienteByTelefone(telefone) {
    const telefoneNumeros = telefone.replace(/\D/g, '');
    const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('telefone', telefone)
        .eq('ativo', true)
        .single();
    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        throw new Error(`Erro ao buscar paciente por telefone: ${error.message}`);
    }
    return data;
}
export async function updatePaciente(id, data) {
    const { data: paciente, error } = await supabase
        .from('pacientes')
        .update(data)
        .eq('id', id)
        .select()
        .single();
    if (error) {
        throw new Error(`Erro ao atualizar paciente: ${error.message}`);
    }
    return paciente;
}
export async function deletePaciente(id) {
    const { error } = await supabase
        .from('pacientes')
        .delete()
        .eq('id', id);
    if (error) {
        throw new Error(`Erro ao deletar paciente: ${error.message}`);
    }
}
