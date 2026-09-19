#!/bin/bash

VERMELHO='\033[1;31m'
VERDE='\033[1;32m'
AMARELO='\033[1;33m'
CIANO='\033[1;36m'
CINZA='\033[0;90m'
RESET='\033[0m'

clear
echo -e "${CINZA}/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,${RESET}"
echo -e "${CIANO}  浤 🪽『NIER SYSTEM』 🪽︎︎︎浤${RESET}"
echo -e "${CINZA}*浤.° ══━━━━━༺Ⓣ༻━━━━━══ °.浤*${RESET}"
echo -e "${CINZA}*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*${RESET}\n"

echo -e "${VERDE}[NIER SYSTEM OK]${RESET} Iniciando protocolo de inicialização..."
echo -e "${CIANO}[NIER SYSTEM COMMAND]${RESET} Estabelecendo conexão com a unidade principal...\n"

while true; do
echo -e "${CINZA}--------------------------------------------------${RESET}"
echo -e "${VERDE}🚀 [STATUS: OPERACIONAL] Running 'node nier.js'...${RESET}"
echo -e "${CINZA}--------------------------------------------------${RESET}\n"

node nier.js
  
EXIT_CODE=$?

echo -e "\n${CINZA}--------------------------------------------------${RESET}"
if [ $EXIT_CODE -eq 0 ]; then
echo -e "${VERDE}✅ [NIER SYSTEM] O bot foi finalizado com sucesso!${RESET}"
else
echo -e "${VERMELHO}❌ [NIER SYSTEM ERROR] Falha detectada! O processo do bot caiu (Código: ${EXIT_CODE}).${RESET}"
  fi

echo -e "${AMARELO}⚠️ [REBOOT PROTOCOL] Reiniciando servidor em 2 segundos...${RESET}"
  echo -e "${CINZA}--------------------------------------------------${RESET}\n"

  sleep 2
done