"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const consultaController_1 = require("../controllers/consultaController");
const router = (0, express_1.Router)();
router.get('/', consultaController_1.listarConsultas);
router.patch('/:id/status', consultaController_1.atualizarStatusConsulta);
exports.default = router;
