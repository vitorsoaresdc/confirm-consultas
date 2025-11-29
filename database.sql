-- ============================================
COMMENT ON COLUMN consultas.status IS 'Status: pendente (aguardando envio), enviada (confirmação enviada), confirmada (paciente confirmou), cancelada (paciente cancelou)';
COMMENT ON COLUMN recorrencias.tipo IS 'Tipo de recorrência: semanal (+7 dias), quinzenal (+14 dias), mensal (+1 mês)';
COMMENT ON COLUMN recorrencias.dia_semana IS '0=domingo, 1=segunda, 2=terça, 3=quarta, 4=quinta, 5=sexta, 6=sábado';
-- Comentários nas colunas

COMMENT ON TABLE consultas IS 'Consultas agendadas (geradas a partir das recorrências)';
COMMENT ON TABLE recorrencias IS 'Configurações de consultas recorrentes';
COMMENT ON TABLE pacientes IS 'Pacientes cadastrados no sistema';
-- Comentários nas tabelas

CREATE INDEX idx_consultas_data_hora ON consultas(data_hora);
CREATE INDEX idx_consultas_status ON consultas(status);
CREATE INDEX idx_consultas_paciente ON consultas(paciente_id);
-- Índices para consultas

);
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  status TEXT NOT NULL CHECK (status IN ('pendente', 'enviada', 'confirmada', 'cancelada')),
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
CREATE TABLE IF NOT EXISTS consultas (
-- Tabela de consultas

CREATE INDEX idx_recorrencias_proxima ON recorrencias(proxima_consulta);
CREATE INDEX idx_recorrencias_ativo ON recorrencias(ativo);
CREATE INDEX idx_recorrencias_paciente ON recorrencias(paciente_id);
-- Índices para recorrências

);
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  ativo BOOLEAN DEFAULT true,
  proxima_consulta TIMESTAMP WITH TIME ZONE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('semanal', 'quinzenal', 'mensal')),
  hora TEXT NOT NULL,
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
CREATE TABLE IF NOT EXISTS recorrencias (
-- Tabela de recorrências

CREATE INDEX idx_pacientes_telefone ON pacientes(telefone);
-- Índice para busca por telefone

);
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  ativo BOOLEAN DEFAULT true,
  telefone TEXT NOT NULL,
  nome TEXT NOT NULL,
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
CREATE TABLE IF NOT EXISTS pacientes (
-- Tabela de pacientes

-- ============================================
-- Script SQL para criar as tabelas no Supabase
-- SISTEMA DE CONFIRMAÇÃO DE CONSULTAS

