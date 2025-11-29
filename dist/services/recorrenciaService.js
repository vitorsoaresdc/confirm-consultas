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
exports.createRecorrencia = createRecorrencia;
exports.getAllRecorrencias = getAllRecorrencias;
exports.getRecorrenciasAtivas = getRecorrenciasAtivas;
exports.updateProximaConsulta = updateProximaConsulta;
const supabase_1 = require("../config/supabase");
const dateUtils_1 = require("../utils/dateUtils");
function createRecorrencia(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: recorrencia, error } = yield supabase_1.supabase
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
    });
}
function getAllRecorrencias() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase_1.supabase
            .from('recorrencias')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(`Erro ao buscar recorrências: ${error.message}`);
        }
        return data || [];
    });
}
function getRecorrenciasAtivas() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase_1.supabase
            .from('recorrencias')
            .select('*')
            .eq('ativo', true);
        if (error) {
            throw new Error(`Erro ao buscar recorrências ativas: ${error.message}`);
        }
        return data || [];
    });
}
function updateProximaConsulta(recorrenciaId, novaData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = yield supabase_1.supabase
            .from('recorrencias')
            .update({ proxima_consulta: (0, dateUtils_1.formatDateToISO)(novaData) })
            .eq('id', recorrenciaId);
        if (error) {
            throw new Error(`Erro ao atualizar próxima consulta: ${error.message}`);
        }
    });
}
