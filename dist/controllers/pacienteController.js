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
exports.criarPaciente = criarPaciente;
exports.listarPacientes = listarPacientes;
exports.atualizarPaciente = atualizarPaciente;
exports.excluirPaciente = excluirPaciente;
const zod_1 = require("zod");
const pacienteService_1 = require("../services/pacienteService");
const createPacienteSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    telefone: zod_1.z.string().min(8, 'Telefone inválido'),
});
function normalizeTelefone(input) {
    const onlyDigits = (input || '').replace(/\D/g, '');
    const withCountry = onlyDigits.startsWith('55') ? onlyDigits : `55${onlyDigits}`;
    const sliced = withCountry.slice(0, 13);
    return `+${sliced}`;
}
function criarPaciente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validatedData = createPacienteSchema.parse(req.body);
            const telefoneNormalizado = normalizeTelefone(validatedData.telefone);
            const telefoneOk = /^\+55\d{10,11}$/.test(telefoneNormalizado);
            if (!telefoneOk) {
                return res.status(400).json({ success: false, error: 'Telefone deve estar no formato +55DDDXXXXXXXXX' });
            }
            const paciente = yield (0, pacienteService_1.createPaciente)({
                nome: validatedData.nome.trim(),
                telefone: telefoneNormalizado,
            });
            return res.status(201).json({ success: true, data: paciente });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ success: false, error: 'Dados inválidos', details: error.errors });
            }
            return res.status(500).json({ success: false, error: error.message });
        }
    });
}
function listarPacientes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pacientes = yield (0, pacienteService_1.getAllPacientes)();
            return res.status(200).json({ success: true, data: pacientes });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    });
}
function atualizarPaciente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const validatedData = createPacienteSchema.parse(req.body);
            const telefoneNormalizado = normalizeTelefone(validatedData.telefone);
            const telefoneOk = /^\+55\d{10,11}$/.test(telefoneNormalizado);
            if (!telefoneOk) {
                return res.status(400).json({ success: false, error: 'Telefone deve estar no formato +55DDDXXXXXXXXX' });
            }
            const paciente = yield (0, pacienteService_1.updatePaciente)(id, {
                nome: validatedData.nome.trim(),
                telefone: telefoneNormalizado,
            });
            return res.status(200).json({ success: true, data: paciente });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ success: false, error: 'Dados inválidos', details: error.errors });
            }
            return res.status(500).json({ success: false, error: error.message });
        }
    });
}
function excluirPaciente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield (0, pacienteService_1.deletePaciente)(id);
            return res.status(200).json({ success: true, message: 'Paciente excluído com sucesso' });
        }
        catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    });
}
