# Sistema de Confirmação de Consultas

Sistema completo em TypeScript para gerenciar consultas psicológicas recorrentes e enviar confirmações automáticas via WhatsApp usando a API Whappi.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Supabase** - Banco de dados PostgreSQL
- **node-cron** - Agendamento de tarefas
- **Whappi API** - Integração WhatsApp
- **Zod** - Validação de dados
- **Axios** - Requisições HTTP

## 📁 Estrutura do Projeto

```
src/
├── config/
│   ├── supabase.ts          # Configuração do Supabase
│   └── whappi.ts            # Configuração da API Whappi
├── controllers/
│   ├── consultaController.ts
│   ├── pacienteController.ts
│   ├── recorrenciaController.ts
│   └── webhookController.ts
├── services/
│   ├── consultaService.ts
│   ├── pacienteService.ts
│   ├── recorrenciaService.ts
│   └── whatsappService.ts
├── jobs/
│   ├── enviarConfirmacoesJob.ts          # Executa a cada 5 minutos
│   └── gerarConsultasRecorrentesJob.ts   # Executa 1x por dia
├── routes/
│   ├── consultaRoutes.ts
│   ├── pacienteRoutes.ts
│   ├── recorrenciaRoutes.ts
│   ├── webhookRoutes.ts
│   └── index.ts
├── types/
│   └── global.d.ts          # Tipos TypeScript
├── utils/
│   └── dateUtils.ts         # Funções utilitárias de data
├── app.ts                   # Configuração do Express
└── server.ts                # Inicialização do servidor
```

## 🗄️ Configuração do Banco de Dados

### 1. Criar Tabelas no Supabase

Execute o SQL contido em `database.sql` no Supabase Dashboard:

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Cole o conteúdo de `database.sql`
5. Execute o script

### 2. Estrutura das Tabelas

**pacientes**
- `id` (UUID) - PK
- `nome` (TEXT)
- `telefone` (TEXT) - formato +55DDDXXXXXXXXX
- `ativo` (BOOLEAN)
- `created_at` (TIMESTAMP)

**recorrencias**
- `id` (UUID) - PK
- `paciente_id` (UUID) - FK → pacientes.id
- `dia_semana` (INTEGER) - 0=domingo, 1=segunda...
- `hora` (TEXT) - formato "HH:MM"
- `tipo` (TEXT) - semanal | quinzenal | mensal
- `proxima_consulta` (TIMESTAMP)
- `ativo` (BOOLEAN)
- `created_at` (TIMESTAMP)

**consultas**
- `id` (UUID) - PK
- `paciente_id` (UUID) - FK → pacientes.id
- `data_hora` (TIMESTAMP)
- `status` (TEXT) - pendente | enviada | confirmada | cancelada
- `created_at` (TIMESTAMP)

## ⚙️ Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Já está configurado no arquivo `.env`:

```env
SUPABASE_URL=https://eylxmqpqxfgmrluvfzku.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
WHAPI_URL=https://gate.whapi.cloud/
WHAPI_TOKEN=8TwtS2UKGt7Kf3ogR9nj1PCV9s1asZPa
```

### 3. Configurar Webhook no Whappi

No painel do Whappi, configure o webhook para apontar para:

```
POST https://seu-dominio.com/webhook/whatsapp
```

## 🏃 Executar o Projeto

### Modo Desenvolvimento (com hot reload)

```bash
npm run dev
```

### Modo Produção

```bash
npm run build
npm start
```

## 📡 Endpoints da API

### Pacientes

**Criar Paciente**
```http
POST /pacientes
Content-Type: application/json

{
  "nome": "João Silva",
  "telefone": "+5511987654321"
}
```

**Listar Pacientes**
```http
GET /pacientes
```

### Recorrências

**Criar Recorrência**
```http
POST /recorrencias
Content-Type: application/json

{
  "paciente_id": "uuid-do-paciente",
  "dia_semana": 1,
  "hora": "16:00",
  "tipo": "semanal",
  "proxima_consulta": "2024-01-15T16:00:00Z"
}
```

**Listar Recorrências**
```http
GET /recorrencias
```

### Consultas

**Listar Consultas**
```http
GET /consultas
```

**Atualizar Status da Consulta**
```http
PATCH /consultas/:id/status
Content-Type: application/json

{
  "status": "confirmada"
}
```

### Webhook

**Receber Mensagem do WhatsApp**
```http
POST /webhook/whatsapp
```

## 🤖 Regras Automatizadas

### Job 1: Gerar Consultas Recorrentes
- **Frequência**: 1x por dia (00:05)
- **Função**: Lê todas as recorrências ativas e cria consultas futuras
- **Atualização**: 
  - Semanal → +7 dias
  - Quinzenal → +14 dias
  - Mensal → +1 mês

### Job 2: Enviar Confirmações
- **Frequência**: A cada 5 minutos
- **Função**: Envia confirmação via WhatsApp 3 horas antes da consulta
- **Mensagem**: 
  ```
  Olá, {nome}! Sua sessão com a Dra. será hoje às {hora}. 
  Pode confirmar? Responda SIM ou NÃO.
  ```

### Processamento de Respostas

O webhook processa as respostas dos pacientes:

- **Confirmação**: "sim", "confirmo", "ok" → status = `confirmada`
- **Cancelamento**: "não", "nao", "cancelar" → status = `cancelada` (notifica psicóloga via log)

## 📝 Exemplos de Uso

### 1. Cadastrar um Paciente

```bash
curl -X POST http://localhost:3000/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "telefone": "+5511999887766"
  }'
```

### 2. Criar Recorrência Semanal

```bash
curl -X POST http://localhost:3000/recorrencias \
  -H "Content-Type: application/json" \
  -d '{
    "paciente_id": "uuid-retornado-acima",
    "dia_semana": 3,
    "hora": "14:00",
    "tipo": "semanal",
    "proxima_consulta": "2024-01-17T14:00:00Z"
  }'
```

### 3. Listar Consultas

```bash
curl http://localhost:3000/consultas
```

## 🔍 Logs e Monitoramento

O sistema gera logs detalhados:

```
[Job] Verificando consultas para envio de confirmação...
[Job] Encontradas 3 consultas pendentes
[WhatsApp] Enviando mensagem para 5511999887766...
[WhatsApp] Mensagem enviada com sucesso
[Job] ✅ Confirmação enviada para Maria Santos
[Webhook] ✅ Consulta uuid-123 CONFIRMADA por Maria Santos
```

## 🛠️ Troubleshooting

### Erro: "Variáveis SUPABASE_URL e SUPABASE_KEY são obrigatórias"
- Verifique se o arquivo `.env` existe e está configurado corretamente

### Erro ao enviar WhatsApp
- Verifique se o `WHAPI_TOKEN` está correto
- Confirme que a instância do Whappi está ativa
- Verifique se o número está no formato internacional (+55...)

### Consultas não sendo geradas
- Verifique se há recorrências ativas no banco
- Confirme que `proxima_consulta` está no passado ou hoje
- Aguarde até 00:05 para o job executar

## 📄 Licença

Projeto privado - Todos os direitos reservados.

