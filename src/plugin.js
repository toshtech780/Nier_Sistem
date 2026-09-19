/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『NIER_SISTEM_PLUGIN_LOADER』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */

const fs = require("fs");
const path = require("path");
const { enviar } = require("./utils");

let comandos = {};
let categorias = {};

const pastaComandos = path.join(__dirname, "comandos");
const pastaRaizSrc = __dirname;

//Ⓣ Função que varre QUALQUER nível de subpasta dentro de comandos
function carregarComandosRecursivo(diretorio) {
if (!fs.existsSync(diretorio)) return;

const itens = fs.readdirSync(diretorio);

for (const item of itens) {
const caminhoCompleto = path.join(diretorio, item);
const stat = fs.statSync(caminhoCompleto);

if (stat.isDirectory()) {
      carregarComandosRecursivo(caminhoCompleto);
} else if (item.endsWith(".js")) {
try {
//Ⓣ Limpa o cache do Node para permitir atualizações instantâneas
delete require.cache[require.resolve(caminhoCompleto)];
const comando = require(caminhoCompleto);

if (comando.nome && typeof comando.executar === "function") {
const nomeCmd = comando.nome.toLowerCase().trim();

comandos[nomeCmd] = comando;

if (Array.isArray(comando.aliases)) {
comando.aliases.forEach(alias => {
comandos[alias.toLowerCase().trim()] = comando;
});
}

const categoria = path.basename(diretorio).toLowerCase();

if (!categorias[categoria]) {
categorias[categoria] = [];
}

if (!categorias[categoria].some(c => c.nome.toLowerCase() === nomeCmd)) {
categorias[categoria].push({
nome: comando.nome,
descricao: comando.descricao || "Sem descrição",
aliases: comando.aliases || []
});
}

console.log(`✅『${categoria.toUpperCase()}』 Comando carregado: /${comando.nome}`);
} else {
console.log(`⚠️ Arquivo ignorado『falta 'nome' ou 'executar'』: ${item}`);
}
} catch (err) {
console.log(`❌ Erro ao carregar o comando ${item}:`, err.message);
}
}
}
}

//Ⓣ Recarrega todos os comandos sem reiniciar a aplicação
function recarregarComandos() {
for (const prop in comandos) delete comandos[prop];
for (const prop in categorias) delete categorias[prop];

if (fs.existsSync(pastaComandos)) {
    carregarComandosRecursivo(pastaComandos);
}
}

//Ⓣ Carga inicial
recarregarComandos();

/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
浤 🪽『MONITOR GLOBAL - AUTO RELOAD RECURSIVO』🪽 浤
*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱*/
let timerReinício = null;

function monitorarDiretorioRecursivo(diretorio) {
if (!fs.existsSync(diretorio)) return;

try {
fs.watch(diretorio, (eventType, filename) => {
if (!filename || (!filename.endsWith(".js") && eventType !== "rename")) return;

if (timerReinício) clearTimeout(timerReinício);

timerReinício = setTimeout(() => {
console.log(`\n🔄『AUTO-RELOAD』Alteração detectada em: ${filename}`);
console.log(`🚀 Atualizando módulos e comandos instantaneamente...\n`);

//Ⓣ Limpa cache global de arquivos JS dentro de src/ incluindo menu.js, utils.js, etc.
Object.keys(require.cache).forEach(id => {
if (id.includes(pastaRaizSrc)) {
delete require.cache[id];
}
});

recarregarComandos();
}, 300);
});

//Ⓣ Monitora subpastas manualmente para compatibilidade total com o Termux
const itens = fs.readdirSync(diretorio);
for (const item of itens) {
const caminho = path.join(diretorio, item);
if (fs.statSync(caminho).isDirectory()) {
monitorarDiretorioRecursivo(caminho);
}
}
} catch (e) {
//Ⓣ Silencia erros de permissão em subpastas temporárias
}
}

//Ⓣ Inicia monitoramento global a partir de src/
monitorarDiretorioRecursivo(pastaRaizSrc);

//Ⓣ Processa e executa os comandos
async function processarComando(ctx, comando, args) {
if (!comando) return;

const cmdLimpo = comando.toLowerCase().trim().replace(/^\//, "");
const objetoComando = comandos[cmdLimpo];

if (objetoComando && typeof objetoComando.executar === "function") {
try {
await objetoComando.executar(ctx, args);
} catch (err) {
console.error(`❌ Erro ao executar /${cmdLimpo}:`, err.message);
await enviar(ctx, "❌ Ocorreu um erro ao executar este comando.");
}
} else {
await enviar(ctx, "❓ Esse comando não existe!");
}
}

module.exports = { processarComando, categorias, recarregarComandos };