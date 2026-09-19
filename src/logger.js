/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『NIER SYSTEM COMMAND ADVANCED LOGGER』 🪽︎︎︎浤
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
bgVermelho: "\x1b[41m\x1b[37m",
bgVerde: "\x1b[42m\x1b[30m",
bgCiano: "\x1b[46m\x1b[30m"
};

module.exports = (bot, prefix, processarComando, enviar, salvarGrupoDb) => {
bot.on("text", async (ctx) => {
//Ⓣ Salva o grupo no banco de dados caso seja um chat coletivo
if ((ctx.chat.type === "group" || ctx.chat.type === "supergroup") && typeof salvarGrupoDb === "function") {
salvarGrupoDb(ctx.chat);
}

const texto = ctx.message.text;
if (!texto || !texto.startsWith(prefix)) return;

//Ⓣ Métricas de Tempo e Dados do Usuário
const tempoInicio = Date.now();
const hora = new Date().toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" });
const usuario = ctx.from.first_name || "Desconhecido";
const username = ctx.from.username ? `@${ctx.from.username}` : "Sem Username";
const idUsuario = ctx.from.id;

//Ⓣ Detalhes da Origem (PV vs Grupo)
const isGroup = ctx.chat.type !== "private";
const tipoChat = isGroup ? "GRUPO" : "PRIVADO";
const nomeGrupo = isGroup ? ctx.chat.title || "Sem Nome" : "Conversa Direta";
const idGrupo = isGroup ? `(${ctx.chat.id})` : "";

//Ⓣ Processamento do Comando e Argumentos
const args = texto.slice(prefix.length).trim().split(/ +/);
const comando = args.shift().toLowerCase();
const parametroCompleto = args.join(" ") || "Nenhum";

//Ⓣ PAINEL DO CONSOLE - YoRHa COMMAND PROTOCOL
 console.log(`\n${C.cinza}┌─[ ${C.bgCiano} NIER SYSTEM LOG DETECTED ${C.reset}${C.cinza} ]────────────────────────────────────────────┐${C.reset}`);
console.log(`${C.cinza}│${C.reset} ${C.bold}${C.ciano}⏰ HORA:${C.reset} ${C.dim}${hora}${C.reset}  ${C.cinza}|${C.reset}  ${C.bold}${C.magento}🌐 TIPO:${C.reset} ${tipoChat}`);
console.log(`${C.cinza}│${C.reset} ${C.bold}${C.amarelo}👤 USUÁRIO:${C.reset} ${C.bold}${usuario}${C.reset} ${C.cinza}(${username})${C.reset} ${C.dim}[ID: ${idUsuario}]${C.reset}`);
if (isGroup) {
console.log(`${C.cinza}│${C.reset} ${C.bold}${C.azul}🏰 ORIGEM:${C.reset}  ${nomeGrupo} ${C.cinza}${idGrupo}${C.reset}`);
}
console.log(`${C.cinza}├───────────────────────────────────────────────────────────────────────────┤${C.reset}`);
console.log(`${C.cinza}│${C.reset} ${C.bold}${C.verde}🎯 COMANDO:${C.reset} ${C.bgVerde} ${prefix}${comando} ${C.reset}`);
console.log(`${C.cinza}│${C.reset} ${C.bold}${C.ciano}📥 PARÂMETROS:${C.reset} ${C.bold}${parametroCompleto}${C.reset} ${C.cinza}(Total de args: ${args.length})${C.reset}`);
console.log(`${C.cinza}└───────────────────────────────────────────────────────────────────────────┘${C.reset}`);

try {
await processarComando(ctx, comando, args);
const ms = Date.now() - tempoInicio;
console.log(`${C.verde}  └─▶ [SUCCESS] Protocolo /${comando} executado em ${ms}ms.${C.reset}\n`);
} catch (err) {
const ms = Date.now() - tempoInicio;
console.log(`\n${C.vermelho}  └─▶ [NIER SYSTEM ERROR] Falha no comando /${comando} (${ms}ms)${C.reset}`);
console.log(`      ${C.bgVermelho} DETALHES ${C.reset} ${C.vermelho}${err.message}${C.reset}\n`);
      
if (typeof enviar === "function") {
await enviar(ctx, "❌ *[NIER SYSTEM ERROR]* Ocorreu uma falha ao executar este comando!");
}
}
});
};
