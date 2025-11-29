"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whappiConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const WHAPI_URL = process.env.WHAPI_URL;
const WHAPI_TOKEN = process.env.WHAPI_TOKEN;
if (!WHAPI_URL || !WHAPI_TOKEN) {
    throw new Error('Variáveis WHAPI_URL e WHAPI_TOKEN são obrigatórias');
}
exports.whappiConfig = {
    baseUrl: WHAPI_URL,
    token: WHAPI_TOKEN,
    headers: {
        'Authorization': `Bearer ${WHAPI_TOKEN}`,
        'Content-Type': 'application/json',
    },
};
