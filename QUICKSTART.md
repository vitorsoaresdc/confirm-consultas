# 🚀 Quick Start Guide

## Passo a Passo Rápido

### 1️⃣ Criar Tabelas no Supabase

Acesse: https://app.supabase.com → Seu Projeto → SQL Editor

Cole e execute este SQL:

```sql
-- Tabela de pacientes
CREATE TABLE IF NOT EXISTS pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pacientes_telefone ON pacientes(telefone);

-- Tabela de recorrências
CREATE TABLE IF NOT EXISTS recorrencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
  hora TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('semanal', 'quinzenal', 'mensal')),
  proxima_consulta TIMESTAMP WITH TIME ZONE NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_recorrencias_paciente ON recorrencias(paciente_id);
CREATE INDEX idx_recorrencias_ativo ON recorrencias(ativo);
CREATE INDEX idx_recorrencias_proxima ON recorrencias(proxima_consulta);

-- Tabela de consultas
CREATE TABLE IF NOT EXISTS consultas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'enviada', 'confirmada', 'cancelada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_consultas_paciente ON consultas(paciente_id);
CREATE INDEX idx_consultas_status ON consultas(status);
CREATE INDEX idx_consultas_data_hora ON consultas(data_hora);
```

### 2️⃣ Instalar Dependências

```bash
npm install
```

### 3️⃣ Verificar .env

O arquivo `.env` já está configurado. Verifique se as credenciais estão corretas:

```env
SUPABASE_URL=https://eylxmqpqxfgmrluvfzku.supabase.co
SUPABASE_KEY=sua-key-aqui
PORT=3000
WHAPI_URL=https://gate.whapi.cloud/
WHAPI_TOKEN=seu-token-aqui
```

### 4️⃣ Rodar o Servidor

```bash
npm run dev
```

Você verá:
```
🚀 Servidor rodando na porta 3000
📍 Health check: http://localhost:3000/health
⏰ Iniciando cron jobs...
✅ Sistema de confirmação de consultas iniciado!
```

### 5️⃣ Testar

Abra outro terminal e execute:

```bash
./test-api.sh
```

Ou teste manualmente:

```bash
# Health check
curl http://localhost:3000/health

# Criar paciente
curl -X POST http://localhost:3000/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "telefone": "+5511987654321"
  }'

# Listar pacientes
curl http://localhost:3000/pacientes
```

### 6️⃣ Configurar Webhook Whappi

1. Acesse o painel do Whappi
2. Vá em Configurações → Webhooks
3. Adicione: `https://seu-dominio.com/webhook/whatsapp`
4. Método: POST

## ✅ Pronto!

O sistema está funcionando. Agora você pode:

- ✅ Cadastrar pacientes
- ✅ Criar recorrências
- ✅ Ver consultas sendo geradas automaticamente
- ✅ Receber confirmações via WhatsApp
- ✅ Processar respostas dos pacientes

## 📚 Documentação Completa

Veja `SETUP.md` para documentação detalhada.

## 🆘 Troubleshooting

**Erro de conexão Supabase:**
- Verifique se SUPABASE_URL e SUPABASE_KEY estão corretas no .env
- Verifique se as tabelas foram criadas

**WhatsApp não envia:**
- Verifique WHAPI_TOKEN no .env
- Confirme que a instância do Whappi está ativa
- Verifique logs no console

**Jobs não executam:**
- Os jobs rodam em horários específicos
- Job de gerar consultas: 00:05 diariamente
- Job de confirmações: a cada 5 minutos
- Você verá logs no console quando executarem

