import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}/`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
