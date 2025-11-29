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
const zod_1 = require("zod");
const pacienteService_1 = require("../services/pacienteService");
const createPacienteSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    telefone: zod_1.z.string().regex(/^\+?55\d{10,11}$/, 'Telefone deve estar no formato +55DDDXXXXXXXXX'),
});
function criarPaciente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validatedData = createPacienteSchema.parse(req.body);
            const paciente = yield (0, pacienteService_1.createPaciente)(validatedData);
            return res.status(201).json({
                success: true,
                data: paciente,
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
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
    });
}
function listarPacientes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pacientes = yield (0, pacienteService_1.getAllPacientes)();
            return res.status(200).json({
                success: true,
                data: pacientes,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    });
}
