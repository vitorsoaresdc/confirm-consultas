# Sistema de Confirmação de Consultas

Sistema completo de agendamento e confirmação de consultas via WhatsApp.

## Stack

- **Backend**: Node.js + TypeScript + Express
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Jobs**: node-cron
- **WhatsApp**: Whappi API

## Início Rápido

```bash
# 1. Instalar dependências
npm install
cd frontend && npm install && cd ..

# 2. Configurar banco de dados
# Execute database.sql no Supabase Dashboard

# 3. Iniciar sistema
npm run dev                    # Backend (porta 3000)
cd frontend && npm run dev     # Frontend (porta 5173)
```

## Acesso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Senha**: `psicologa123`

## Estrutura

```
confirm-consultas/
├── src/                    # Backend
│   ├── config/            # Configurações (Supabase, WhatsApp)
│   ├── controllers/       # Controladores REST
│   ├── services/          # Lógica de negócio
│   ├── jobs/              # Jobs automáticos
│   ├── routes/            # Rotas Express
│   ├── types/             # Tipos TypeScript
│   └── utils/             # Utilitários
│
└── frontend/              # Dashboard Web
    └── src/
        ├── components/    # Login + Dashboard
        └── services/      # API client

```

## Funcionalidades

### Backend (API REST)
- ✅ CRUD completo de Pacientes
- ✅ CRUD completo de Recorrências
- ✅ Listagem de Consultas
- ✅ Webhook WhatsApp
- ✅ Jobs automáticos (gerar consultas, enviar mensagens)
- ✅ Validações com Zod
- ✅ CORS habilitado

### Frontend (Dashboard)
- ✅ Login com autenticação
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de pacientes (criar, editar, excluir, buscar)
- ✅ Gerenciamento de recorrências (criar, editar, excluir)
- ✅ Visualização de consultas com status
- ✅ Design moderno e responsivo

## Endpoints

```
POST   /pacientes          - Criar paciente
GET    /pacientes          - Listar pacientes
PUT    /pacientes/:id      - Atualizar paciente
DELETE /pacientes/:id      - Excluir paciente

POST   /recorrencias       - Criar recorrência
GET    /recorrencias       - Listar recorrências
PUT    /recorrencias/:id   - Atualizar recorrência
DELETE /recorrencias/:id   - Excluir recorrência

GET    /consultas          - Listar consultas
PATCH  /consultas/:id/status - Atualizar status

POST   /webhook/whatsapp   - Webhook do WhatsApp
```

## Jobs Automáticos

### Gerar Consultas
- **Frequência**: Diariamente às 00:05
- **Função**: Cria consultas futuras baseadas nas recorrências ativas

### Enviar Confirmações
- **Frequência**: A cada 5 minutos
- **Função**: Envia mensagens WhatsApp 3 horas antes da consulta

## Scripts

```bash
# Backend
npm run dev      # Desenvolvimento (hot reload)
npm run build    # Build TypeScript
npm start        # Produção

# Frontend
cd frontend
npm run dev      # Desenvolvimento
npm run build    # Build para produção
```

## Ambiente (.env)

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
PORT=3000
WHAPI_URL=https://gate.whapi.cloud/
WHAPI_TOKEN=your_whapi_token
```

## Banco de Dados

Execute `database.sql` no Supabase para criar:
- Tabela `pacientes`
- Tabela `recorrencias`
- Tabela `consultas`
- Índices e constraints

## Desenvolvido com 💜

