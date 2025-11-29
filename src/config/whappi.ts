import dotenv from 'dotenv';

dotenv.config();

const WHAPI_URL = process.env.WHAPI_URL;
const WHAPI_TOKEN = process.env.WHAPI_TOKEN;

if (!WHAPI_URL || !WHAPI_TOKEN) {
  throw new Error('Variáveis WHAPI_URL e WHAPI_TOKEN são obrigatórias');
}

export const whappiConfig = {
  baseUrl: WHAPI_URL,
  token: WHAPI_TOKEN,
  headers: {
    'Authorization': `Bearer ${WHAPI_TOKEN}`,
    'Content-Type': 'application/json',
  },
};

