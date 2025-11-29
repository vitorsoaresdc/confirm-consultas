"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaciente = createPaciente;
exports.getAllPacientes = getAllPacientes;
exports.getPacienteById = getPacienteById;
exports.getPacienteByTelefone = getPacienteByTelefone;
const supabase_1 = require("../config/supabase");
function createPaciente(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: paciente, error } = yield supabase_1.supabase
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
    });
}
function getAllPacientes() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase_1.supabase
            .from('pacientes')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(`Erro ao buscar pacientes: ${error.message}`);
        }
        return data || [];
    });
}
function getPacienteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase_1.supabase
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
    });
}
function getPacienteByTelefone(telefone) {
    return __awaiter(this, void 0, void 0, function* () {
        const telefoneNumeros = telefone.replace(/\D/g, '');
        const { data, error } = yield supabase_1.supabase
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
    });
}
