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
exports.listarConsultas = listarConsultas;
exports.atualizarStatusConsulta = atualizarStatusConsulta;
const zod_1 = require("zod");
const consultaService_1 = require("../services/consultaService");
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pendente', 'enviada', 'confirmada', 'cancelada'], {
        errorMap: () => ({ message: 'Status deve ser: pendente, enviada, confirmada ou cancelada' }),
    }),
});
function listarConsultas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const consultas = yield (0, consultaService_1.getAllConsultas)();
            return res.status(200).json({
                success: true,
                data: consultas,
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
function atualizarStatusConsulta(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const validatedData = updateStatusSchema.parse(req.body);
            const consulta = yield (0, consultaService_1.updateConsultaStatus)(id, validatedData.status);
            return res.status(200).json({
                success: true,
                data: consulta,
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
