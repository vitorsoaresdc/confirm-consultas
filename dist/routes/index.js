"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pacienteRoutes_1 = __importDefault(require("./pacienteRoutes"));
const recorrenciaRoutes_1 = __importDefault(require("./recorrenciaRoutes"));
const consultaRoutes_1 = __importDefault(require("./consultaRoutes"));
const webhookRoutes_1 = __importDefault(require("./webhookRoutes"));
const router = (0, express_1.Router)();
router.use('/pacientes', pacienteRoutes_1.default);
router.use('/recorrencias', recorrenciaRoutes_1.default);
router.use('/consultas', consultaRoutes_1.default);
router.use('/webhook', webhookRoutes_1.default);
exports.default = router;
