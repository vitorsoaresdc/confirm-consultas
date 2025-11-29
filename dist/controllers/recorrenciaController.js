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
exports.criarRecorrencia = criarRecorrencia;
exports.listarRecorrencias = listarRecorrencias;
const zod_1 = require("zod");
const recorrenciaService_1 = require("../services/recorrenciaService");
const createRecorrenciaSchema = zod_1.z.object({
    paciente_id: zod_1.z.string().uuid('ID do paciente deve ser um UUID válido'),
    dia_semana: zod_1.z.number().int().min(0).max(6, 'Dia da semana deve ser entre 0 (domingo) e 6 (sábado)'),
    hora: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora deve estar no formato HH:MM'),
    tipo: zod_1.z.enum(['semanal', 'quinzenal', 'mensal'], {
        errorMap: () => ({ message: 'Tipo deve ser: semanal, quinzenal ou mensal' }),
    }),
    proxima_consulta: zod_1.z.string().datetime('Data da próxima consulta deve ser um datetime ISO válido'),
});
function criarRecorrencia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validatedData = createRecorrenciaSchema.parse(req.body);
            const recorrencia = yield (0, recorrenciaService_1.createRecorrencia)(validatedData);
            return res.status(201).json({
                success: true,
                data: recorrencia,
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
function listarRecorrencias(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const recorrencias = yield (0, recorrenciaService_1.getAllRecorrencias)();
            return res.status(200).json({
                success: true,
                data: recorrencias,
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
