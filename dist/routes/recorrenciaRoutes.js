"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recorrenciaController_1 = require("../controllers/recorrenciaController");
const router = (0, express_1.Router)();
router.post('/', recorrenciaController_1.criarRecorrencia);
router.get('/', recorrenciaController_1.listarRecorrencias);
exports.default = router;
