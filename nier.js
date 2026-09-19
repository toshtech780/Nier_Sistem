/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『NIER_SISTEM_INDEX』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const Telegraf = require("telegraf");
const { Markup } = require("telegraf");
const https = require("https");
const events = require("events");
const fs = require("fs");
const path = require("path");
const { conectarComRetry } = require("./src/conexao");
const { token, prefix, NomeDoBot, NickDono } = require("./src/config");
const { processarComando, categorias } = require("./src/plugin");
const { enviar } = require("./src/utils");
const apiModule = require("./src/api");
//Ⓣ Remove o limite global de ouvintes de eventos para conexões HTTPS/Sockets
events.EventEmitter.defaultMaxListeners = 0;
https.globalAgent.setMaxListeners(0);
process.setMaxListeners(0);
//Ⓣ Configuração do Bot com agente HTTPS persistente e timeout estendido
const agent = new https.Agent({
keepAlive: true,
keepAliveMsecs: 10000,
timeout: 30000
});

const bot = new Telegraf(token, {
telegram: { agent }
});
//Ⓣ Tratamento De Erros Globais Da Sessão 
bot.catch((err, ctx) => {
console.log(`\n❌『ERRO DE CONEXÃO/SESSÃO』em ${ctx.updateType}:`, err.message);
});

/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
    🪽『AÇÕES DOS BOTÕES COM BARRA DE PROGRESSO』 🪽
*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱*/
function obterUrlApi() {
const baseUrl = apiModule.apiBaseUrl || "https://toshtech.com.br";
const key = apiModule.apiKey || "";
return { baseUrl, key };
}

function reconstruirYoutubeUrl(dadoDecodificado) {
if (!dadoDecodificado) return "";
if (dadoDecodificado.startsWith("http")) {
return dadoDecodificado;
}
return `https://www.youtube.com/watch?v=${dadoDecodificado}`;
}
//Ⓣ Ação: Download de Áudio (MP3)
bot.action(/dl_aud_(.+)/, async (ctx) => {
await ctx.answerCbQuery("⏳ Iniciando download do áudio...").catch(() => {});
//Ⓣ Envia a mensagem inicial com a barra de progresso
const msgStatus = await ctx.reply("⏳ *Baixando Áudio...*\n\n[▒▒▒▒▒▒▒▒▒▒] 0%", {
parse_mode: "Markdown",
reply_to_message_id: ctx.callbackQuery.message.message_id
});
try {
//Ⓣ Atualiza a barra para 50%
await ctx.telegram.editMessageText(
ctx.chat.id,
msgStatus.message_id,
null,
"⏳ *Processando o arquivo na Tosh Tech API...*\n\n[█████▒▒▒▒▒] 50%",
{ parse_mode: "Markdown" }
).catch(() => {});

const hexData = ctx.match[1];
const payload = Buffer.from(hexData, "hex").toString("utf-8");
const youtubeUrl = reconstruirYoutubeUrl(payload);
    
const { baseUrl, key } = obterUrlApi();
const audioDirectUrl = `${baseUrl}/api/download/playv2?url=${encodeURIComponent(youtubeUrl)}&apikey=${key}`;
//Ⓣ Atualiza a barra para 80% (Enviando ao Telegram)
await ctx.telegram.editMessageText(
ctx.chat.id,
msgStatus.message_id,
null,
"🚀 *Enviando áudio para o chat...*\n\n[████████▒▒] 80%",
{ parse_mode: "Markdown" }
).catch(() => {});

await ctx.replyWithAudio(
{ url: audioDirectUrl },
{ reply_to_message_id: ctx.callbackQuery.message.message_id }
);
//Ⓣ Apaga a mensagem de status após concluir
await ctx.telegram.deleteMessage(ctx.chat.id, msgStatus.message_id).catch(() => {});
} catch (err) {
console.error("❌ Erro ao enviar áudio nativo:", err.message);
try {
const hexData = ctx.match[1];
const payload = Buffer.from(hexData, "hex").toString("utf-8");
const youtubeUrl = reconstruirYoutubeUrl(payload);
const { baseUrl, key } = obterUrlApi();
const audioDirectUrl = `${baseUrl}/api/download/playv2?url=${encodeURIComponent(youtubeUrl)}&apikey=${key}`;
await ctx.replyWithDocument(
{ url: audioDirectUrl, filename: "Audio.mp3" },
{ caption: "🎵 *Áudio enviado como arquivo*", parse_mode: "Markdown" }
);
await ctx.telegram.deleteMessage(ctx.chat.id, msgStatus.message_id).catch(() => {});
} catch (e) {
await ctx.telegram.editMessageText(
ctx.chat.id,
msgStatus.message_id,
null,
"❌ *Falha ao baixar o áudio.* Tente novamente mais tarde!",
{ parse_mode: "Markdown" }
).catch(() => {});
}
}
});
//Ⓣ Ação: Download de Vídeo (MP4)
bot.action(/dl_vid_(.+)/, async (ctx) => {
await ctx.answerCbQuery("⏳ Iniciando download do vídeo...").catch(() => {});
//Ⓣ Envia a mensagem inicial com a barra de progresso
const msgStatus = await ctx.reply("⏳ *Baixando Vídeo...*\n\n[▒▒▒▒▒▒▒▒▒▒] 0%", {
parse_mode: "Markdown",
reply_to_message_id: ctx.callbackQuery.message.message_id
});
try {
//Ⓣ Atualiza a barra para 50%
await ctx.telegram.editMessageText(
ctx.chat.id,
msgStatus.message_id,
null,
"⏳ *Processando o vídeo na Tosh Tech API...*\n\n[█████▒▒▒▒▒] 50%",
{ parse_mode: "Markdown" }
).catch(() => {});
const hexData = ctx.match[1];
const payload = Buffer.from(hexData, "hex").toString("utf-8");
const youtubeUrl = reconstruirYoutubeUrl(payload);
const { baseUrl, key } = obterUrlApi();
const videoDirectUrl = `${baseUrl}/api/download/playvdv2?url=${encodeURIComponent(youtubeUrl)}&apikey=${key}`;
//Ⓣ Atualiza a barra para 80% (Enviando ao Telegram)
await ctx.telegram.editMessageText(
ctx.chat.id,
msgStatus.message_id,
null,
"🚀 *Enviando vídeo para o chat...*\n\n[████████▒▒] 80%",
{ parse_mode: "Markdown" }
).catch(() => {});
await ctx.replyWithVideo(
{ url: videoDirectUrl },
{ reply_to_message_id: ctx.callbackQuery.message.message_id }
);
//Ⓣ Apaga a mensagem de status após concluir
await ctx.telegram.deleteMessage(ctx.chat.id, msgStatus.message_id).catch(() => {});
} catch (err) {
console.error("❌ Erro ao enviar vídeo nativo:", err.message);
try {
const hexData = ctx.match[1];
const payload = Buffer.from(hexData, "hex").toString("utf-8");
const youtubeUrl = reconstruirYoutubeUrl(payload);
const { baseUrl, key } = obterUrlApi();
const videoDirectUrl = `${baseUrl}/api/download/playvdv2?url=${encodeURIComponent(youtubeUrl)}&apikey=${key}`;
await ctx.replyWithDocument(
{ url: videoDirectUrl, filename: "Video.mp4" },
{ caption: "🎬 *Vídeo enviado como arquivo*", parse_mode: "Markdown" }
);
await ctx.telegram.deleteMessage(ctx.chat.id, msgStatus.message_id).catch(() => {});
} catch (e) {
await ctx.telegram.editMessageText(
ctx.chat.id,
msgStatus.message_id,
null,
"❌ *Falha ao baixar o vídeo.* Tente novamente mais tarde!",
{ parse_mode: "Markdown" }
).catch(() => {});
}
}
});
//Ⓣ Ação: Fechar Menu
bot.action("menu_fechar", async (ctx) => {
await ctx.answerCbQuery("Menu fechado").catch(() => {});
try {
await ctx.deleteMessage();
} catch (e) {}
});

/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『GERENCIADOR DE GRUPOS DA BASE DE DADOS』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const dbGruposPath = path.resolve(__dirname, "./src/database/grupos.json");

function salvarGrupoDb(chat) {
if (!chat || (chat.type !== "group" && chat.type !== "supergroup")) return;
try {
let grupos = [];
if (fs.existsSync(dbGruposPath)) {
grupos = JSON.parse(fs.readFileSync(dbGruposPath, "utf-8"));
}
const existe = grupos.find(function(g) { return g.id === chat.id; });
if (!existe) {
grupos.push({ id: chat.id, name: chat.title || "Grupo sem nome" });
const dir = path.dirname(dbGruposPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dbGruposPath, JSON.stringify(grupos, null, 2), "utf-8");
console.log(`➕『GRUPO ADICIONADO』:${chat.title} (${chat.id})`);
}
} catch (e) {
console.log("❌ Erro ao salvar grupo no banco:", e.message);
}
}

function removerGrupoDb(chatId) {
try {
if (!fs.existsSync(dbGruposPath)) return;
let grupos = JSON.parse(fs.readFileSync(dbGruposPath, "utf-8"));
const tamanhoOriginal = grupos.length;
    
grupos = grupos.filter(function(g) { return g.id !== chatId; });

if (grupos.length < tamanhoOriginal) {
fs.writeFileSync(dbGruposPath, JSON.stringify(grupos, null, 2), "utf-8");
console.log(`🗑️『GRUPO REMOVIDO』:ID ${chatId}`);
}
} catch (e) {
console.log("❌ Erro ao remover grupo do banco:", e.message);
}
}
//Ⓣ Escuta entrada ou saída do próprio bot dos chats
bot.on("my_chat_member", (ctx) => {
const statusNovo = ctx.myChatMember.new_chat_member.status;
if (statusNovo === "kicked" || statusNovo === "left") {
removerGrupoDb(ctx.chat.id);
} else if (statusNovo === "member" || statusNovo === "administrator") {
salvarGrupoDb(ctx.chat);
}
});

/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
浤 🪽『SISTEMA AUTOMÁTICO DE BOAS-VINDAS』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤*    */
bot.on("new_chat_members", async (ctx) => {
const dbPath = path.resolve(__dirname, "./src/database/welcome.json");
  const FOTO_PADRAO_URL = "https://raw.githubusercontent.com/toshhost/Toshupload2/main/uploads/7a92b6fd7347fea26a4f95fc1-7ykui.jpg";
if (!fs.existsSync(dbPath)) return;
try {
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const chatId = ctx.chat.id.toString();
const configGrupo = db[chatId];
//Ⓣ Checa se o grupo tem a recepção ativada
if (!configGrupo || !configGrupo.ativo) return;
const novosMembros = ctx.message.new_chat_members;
for (const membro of novosMembros) {
//Ⓣ Ignora se o novo membro for o próprio Bot
if (membro.is_bot) continue;
const nome = membro.first_name || "Membro";
const grupoNome = ctx.chat.title || "Grupo";
const idUsuario = membro.id;
//Ⓣ Substitui as tags pelo valor real
let textoBoasVindas = (configGrupo.texto || "Bem-vindo {nome}!")
.replace(/\{nome\}/g, nome)
.replace(/\{grupo\}/g, grupoNome)
.replace(/\{id\}/g, idUsuario);
//Ⓣ Tenta buscar a foto de perfil do novo membro no Telegram
let fotoEnviar = null;
try {
const fotosPerfil = await ctx.telegram.getUserProfilePhotos(idUsuario, 0, 1);
if (fotosPerfil && fotosPerfil.total_count > 0) {
fotoEnviar = fotosPerfil.photos[0][fotosPerfil.photos[0].length - 1].file_id;
}
} catch (e) {
console.log("⚠️ Não foi possível obter foto de perfil do usuário.");
}
//Ⓣ  Se não tiver foto de perfil, usa a foto customizada do grupo ou a Foto Padrão via URL
if (!fotoEnviar) {
fotoEnviar = configGrupo.foto || FOTO_PADRAO_URL;
}
//Ⓣ Envia a mensagem com a imagem correspondente
try {
await ctx.replyWithPhoto(fotoEnviar, {
caption: textoBoasVindas,
parse_mode: "Markdown" });
} catch (errFoto) {
//Ⓣ Fallback caso ocorra algum erro no envio da imagem
await ctx.replyWithMarkdown(textoBoasVindas);
}
}
} catch (err) {
console.error("❌ Erro ao enviar mensagem de boas-vindas:", err.message);
}
});

/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
   浤 🪽『INICIALIZAÇÃO DO LOGGER』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */

//Ⓣ Importa a função do logger
const logger = require("./src/logger");

//Ⓣ Executa a função passando o bot e suas variáveis
logger(bot, prefix, processarComando, enviar, salvarGrupoDb);

/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『SISTEMA DE BOTÕES INLINE CALLBACKS』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
//Ⓣ Importa os menus manuais diretamente do arquivo menu.js
const caminhoMenu = path.join(__dirname, "src", "menu.js");

function obterMenusManuais() {
try {
if (fs.existsSync(caminhoMenu)) {
delete require.cache[require.resolve(caminhoMenu)];
return require(caminhoMenu).menusManuais || {};
}
} catch (e) {
console.error("Erro ao carregar menu.js:", e.message);
}
return {};
}

//Ⓣ Ação para Entrar na Categoria
bot.action(/cat_(.+)/, async (ctx) => {
try { await ctx.answerCbQuery(); } catch (e) {}

const categoria = ctx.match[1].toLowerCase();
const { categorias } = require("./src/plugin");
const menusManuais = obterMenusManuais();

//Ⓣ Pega o texto customizado do menu.js; se não houver, tenta gerar com os comandos da pasta
let textoMenu = menusManuais[categoria];

if (!textoMenu) {
const listaCmds = categorias[categoria] || [];
if (listaCmds.length > 0) {
textoMenu = `✦ *CATEGORIA: ${categoria.toUpperCase()}* ✦\n°✽°┈━━━━━━⊱ ✟ ⊰━━━━━━┈°✽°\n\n`;
listaCmds.forEach((cmd, idx) => {
textoMenu += `✦${idx + 1} */${cmd.nome}* ➔ ${cmd.descricao}\n`;
});
} else {
textoMenu = `📂 *CATEGORIA: ${categoria.toUpperCase()}*\n\n⚠️ Em breve novos comandos.`;
}
}

//Ⓣ Remonta os botões marcando a categoria selecionada com '▶️'
const listaCategorias = Object.keys(categorias || {});
const botoes = [];

for (let i = 0; i < listaCategorias.length; i += 2) {
const par = [];
const cat1 = listaCategorias[i];
par.push(Markup.callbackButton(`${cat1 === categoria ? "▶️ " : "📁 "}${cat1.toUpperCase()}`, `cat_${cat1}`));

if (listaCategorias[i + 1]) {
const cat2 = listaCategorias[i + 1];
par.push(Markup.callbackButton(`${cat2 === categoria ? "▶️ " : "📁 "}${cat2.toUpperCase()}`, `cat_${cat2}`));
}
botoes.push(par);
}

//Ⓣ Linha de navegação inferior
botoes.push([
Markup.callbackButton("🔙 VOLTAR AO MENU", "menu_voltar"),
Markup.callbackButton("❌ FECHAR", "menu_fechar")
]);

try {
await ctx.editMessageCaption(textoMenu, {
parse_mode: "Markdown",
...Markup.inlineKeyboard(botoes).extra()
});
} catch (e) {
try {
await ctx.editMessageText(textoMenu, {
parse_mode: "Markdown",
...Markup.inlineKeyboard(botoes).extra()
});
} catch (err) {}
}
});

//Ⓣ Ação para Voltar ao Menu Principal
bot.action("menu_voltar", async (ctx) => {
try { await ctx.answerCbQuery(); } catch (e) {}

const { categorias } = require("./src/plugin");
const nomeUsuario = ctx.from.first_name || "Membro";
const listaCategorias = Object.keys(categorias || {});

const botoes = [];
for (let i = 0; i < listaCategorias.length; i += 2) {
const par = [];
const cat1 = listaCategorias[i];
par.push(Markup.callbackButton(`📁 ${cat1.toUpperCase()}`, `cat_${cat1}`));

if (listaCategorias[i + 1]) {
const cat2 = listaCategorias[i + 1];
par.push(Markup.callbackButton(`📁 ${cat2.toUpperCase()}`, `cat_${cat2}`));
}
botoes.push(par);
}
botoes.push([Markup.callbackButton("❌ FECHAR MENU", "menu_fechar")]);

const mensagemMenu = 
`°◈°┈━━━━⊱✟NIER SYSTEM✟⊰━━━━┈°◈°

Olá, *『${nomeUsuario}』*! Seja bem-vindo『a』ao menu!

Selecione uma categoria abaixo para acessar os comandos:`;

try {
await ctx.editMessageCaption(mensagemMenu, {
parse_mode: "Markdown",
...Markup.inlineKeyboard(botoes).extra()
});
} catch (e) {
try {
await ctx.editMessageText(mensagemMenu, {
parse_mode: "Markdown",
...Markup.inlineKeyboard(botoes).extra()
});
} catch (err) {}
}
});

//Ⓣ Ação para Apagar a Mensagem de Menu
bot.action("menu_fechar", async (ctx) => {
try {
await ctx.answerCbQuery("Menu fechado!");
await ctx.deleteMessage();
} catch (e) {}
});

/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『FUNÇÃO DE RECONEXÃO COM TENTATIVAS』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */

//Ⓣ Executa a reconexão automatizada
conectarComRetry(bot, token, prefix, NomeDoBot, NickDono);

//Ⓣ Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));