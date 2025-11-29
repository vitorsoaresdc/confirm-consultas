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
exports.createConsulta = createConsulta;
exports.getAllConsultas = getAllConsultas;
exports.getConsultasPendentes = getConsultasPendentes;
exports.updateConsultaStatus = updateConsultaStatus;
exports.getProximaConsultaEnviadaPorPaciente = getProximaConsultaEnviadaPorPaciente;
exports.verificarConsultaDuplicada = verificarConsultaDuplicada;
const supabase_1 = require("../config/supabase");
const dateUtils_1 = require("../utils/dateUtils");
function createConsulta(pacienteId, dataHora) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: consulta, error } = yield supabase_1.supabase
            .from('consultas')
            .insert({
            paciente_id: pacienteId,
            data_hora: (0, dateUtils_1.formatDateToISO)(dataHora),
            status: 'pendente',
        })
            .select()
            .single();
        if (error) {
            throw new Error(`Erro ao criar consulta: ${error.message}`);
        }
        return consulta;
    });
}
function getAllConsultas() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase_1.supabase
            .from('consultas')
            .select('*')
            .order('data_hora', { ascending: true });
        if (error) {
            throw new Error(`Erro ao buscar consultas: ${error.message}`);
        }
        return data || [];
    });
}
function getConsultasPendentes() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase_1.supabase
            .from('consultas')
            .select('*')
            .eq('status', 'pendente')
            .order('data_hora', { ascending: true });
        if (error) {
            throw new Error(`Erro ao buscar consultas pendentes: ${error.message}`);
        }
        return data || [];
    });
}
function updateConsultaStatus(consultaId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: consulta, error } = yield supabase_1.supabase
            .from('consultas')
            .update({ status })
            .eq('id', consultaId)
            .select()
            .single();
        if (error) {
            throw new Error(`Erro ao atualizar status da consulta: ${error.message}`);
        }
        return consulta;
    });
}
function getProximaConsultaEnviadaPorPaciente(pacienteId) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const { data, error } = yield supabase_1.supabase
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
    });
}
function verificarConsultaDuplicada(pacienteId, dataHora) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabase_1.supabase
            .from('consultas')
            .select('id')
            .eq('paciente_id', pacienteId)
            .eq('data_hora', (0, dateUtils_1.formatDateToISO)(dataHora))
            .limit(1);
        if (error) {
            throw new Error(`Erro ao verificar duplicata: ${error.message}`);
        }
        return ((data === null || data === void 0 ? void 0 : data.length) || 0) > 0;
    });
}
