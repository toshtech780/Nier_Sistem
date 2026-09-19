/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『NIER SYSTEM PROTOCOLO DE CONEXÃO』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */

//Ⓣ CORES ANSI PARA O CONSOLE
const C = {
reset: "\x1b[0m",
bold: "\x1b[1m",
dim: "\x1b[2m",
vermelho: "\x1b[31m",
verde: "\x1b[32m",
amarelo: "\x1b[33m",
azul: "\x1b[34m",
magento: "\x1b[35m",
ciano: "\x1b[36m",
cinza: "\x1b[90m",
bgVerde: "\x1b[42m\x1b[30m",
bgVermelho: "\x1b[41m\x1b[37m",
bgCiano: "\x1b[46m\x1b[30m"
};

async function conectarComRetry(bot, config = {}, tentativa = 1) {
const maxTentativas = 5;
const tempoEspera = 5000;

const nomeBot = config.NomeDoBot || "NIER SYSTEM";
const nickDono = config.NickDono || "Dono";
const prefixo = config.prefix || "/";

try {
console.log(`\n${C.cinza}┌─[ ${C.bgCiano} NIER SYSTEM CONNECTING ${C.reset}${C.cinza} ]────────────────────────────────────────────┐${C.reset}`);
console.log(`${C.cinza}│${C.reset} ${C.bold}${C.ciano}⚡ PROTOCOLO DE CONEXÃO:${C.reset} Iniciando tentativa ${C.bold}${C.amarelo}${tentativa}/${maxTentativas}${C.reset}...`);
console.log(`${C.cinza}└───────────────────────────────────────────────────────────────────────────┘${C.reset}`);

await bot.telegram.callApi("deleteWebhook", { drop_pending_updates: true });
console.log(` ${C.verde}└─▶ 🧹 [CLEANUP] Fila de mensagens antigas limpa com sucesso!${C.reset}`);

await bot.launch();

console.log(`\n${C.cinza}┌─[ ${C.bgVerde} NIER SYSTEM ONLINE STATUS ${C.reset}${C.cinza} ]─────────────────────────────────────────┐${C.reset}`);
console.log(`${C.cinza}│${C.reset} ${C.bold}${C.verde}🤖 BOT STATUS:${C.reset}  ${C.bold}${C.ciano}${nomeBot}${C.reset} ${C.verde}está ON e rodando liso!${C.reset}`);
console.log(`${C.cinza}│${C.reset} ${C.bold}${C.magento}👑 UNIDADE DONO:${C.reset} ${C.bold}${nickDono}${C.reset}`);
console.log(`${C.cinza}│${C.reset} ${C.bold}${C.amarelo}💬 PREFIXO:${C.reset}      ${C.bgCiano} ${prefixo} ${C.reset}`);
console.log(`${C.cinza}└───────────────────────────────────────────────────────────────────────────┘${C.reset}\n`);

} catch (err) {
console.log(`\n${C.vermelho}❌ [CONNECTION ERROR] Falha na tentativa ${tentativa}: ${err.message}${C.reset}`);

if (tentativa < maxTentativas) {
console.log(`${C.amarelo}⏳ [RETRY PROTOCOL] Reconectando em ${tempoEspera / 1000} segundos...${C.reset}\n`);
setTimeout(() => conectarComRetry(bot, config, tentativa + 1), tempoEspera);
} else {
console.log(`\n${C.cinza}┌─[ ${C.bgVermelho} FATAL ERROR NIER SYSTEM ${C.reset}${C.cinza} ]────────────────────────────────────────┐${C.reset}`);
console.log(`${C.cinza}│${C.reset} ${C.vermelho}❌ Não foi possível conectar ao Telegram após ${maxTentativas} tentativas.${C.reset}`);
console.log(`${C.cinza}└───────────────────────────────────────────────────────────────────────────┘${C.reset}\n`);
}
}
}

module.exports = { conectarComRetry };