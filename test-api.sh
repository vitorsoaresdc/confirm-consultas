#!/bin/bash

# Script de Testes para o Sistema de Confirmação de Consultas
# Uso: ./test-api.sh

BASE_URL="http://localhost:3000"

echo "🧪 Testando Sistema de Confirmação de Consultas"
echo "================================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Health Check
echo -e "${BLUE}1. Health Check${NC}"
curl -s "$BASE_URL/health" | jq .
echo -e "\n"

# 2. Criar Paciente
echo -e "${BLUE}2. Criar Paciente${NC}"
PACIENTE_RESPONSE=$(curl -s -X POST "$BASE_URL/pacientes" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos Teste",
    "telefone": "+5511999887766"
  }')

echo "$PACIENTE_RESPONSE" | jq .
PACIENTE_ID=$(echo "$PACIENTE_RESPONSE" | jq -r '.data.id')
echo -e "${GREEN}Paciente ID: $PACIENTE_ID${NC}\n"

# 3. Listar Pacientes
echo -e "${BLUE}3. Listar Pacientes${NC}"
curl -s "$BASE_URL/pacientes" | jq .
echo -e "\n"

# 4. Criar Recorrência
echo -e "${BLUE}4. Criar Recorrência (Semanal, Segunda-feira 14:00)${NC}"

# Calcular próxima segunda-feira
PROXIMA_CONSULTA=$(date -v+mon -v14H -v0M -v0S +"%Y-%m-%dT%H:%M:%SZ")

RECORRENCIA_RESPONSE=$(curl -s -X POST "$BASE_URL/recorrencias" \
  -H "Content-Type: application/json" \
  -d "{
    \"paciente_id\": \"$PACIENTE_ID\",
    \"dia_semana\": 1,
    \"hora\": \"14:00\",
    \"tipo\": \"semanal\",
    \"proxima_consulta\": \"$PROXIMA_CONSULTA\"
  }")

echo "$RECORRENCIA_RESPONSE" | jq .
echo -e "\n"

# 5. Listar Recorrências
echo -e "${BLUE}5. Listar Recorrências${NC}"
curl -s "$BASE_URL/recorrencias" | jq .
echo -e "\n"

# 6. Listar Consultas
echo -e "${BLUE}6. Listar Consultas${NC}"
curl -s "$BASE_URL/consultas" | jq .
echo -e "\n"

# 7. Criar uma consulta manualmente para testar
echo -e "${BLUE}7. Criar Consulta Manual (para teste)${NC}"
# Consulta em 2h30min (para não disparar o job de 3h)
CONSULTA_TESTE=$(date -v+2H -v+30M +"%Y-%m-%dT%H:%M:%SZ")

echo -e "${YELLOW}Nota: Para testar envio automático, crie uma consulta para daqui a 2h55min${NC}"
echo -e "Consulta de teste: $CONSULTA_TESTE\n"

# 8. Testar Webhook (simulação)
echo -e "${BLUE}8. Simular Webhook do WhatsApp${NC}"
echo -e "${YELLOW}Simulando confirmação...${NC}"

curl -s -X POST "$BASE_URL/webhook/whatsapp" \
  -H "Content-Type: application/json" \
  -d "{
    \"from\": \"+5511999887766\",
    \"body\": \"sim\"
  }" | jq .

echo -e "\n"

echo -e "${GREEN}✅ Testes concluídos!${NC}"
echo ""
echo "📋 Comandos úteis:"
echo "  - Ver todas consultas: curl $BASE_URL/consultas | jq ."
echo "  - Ver pacientes: curl $BASE_URL/pacientes | jq ."
echo "  - Ver recorrências: curl $BASE_URL/recorrencias | jq ."
echo ""

