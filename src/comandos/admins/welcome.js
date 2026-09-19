/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『NIER_SISTEM_WELCOME』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const fs = require("fs");
const path = require("path");
const { enviar } = require("../../utils");

const dbPath = path.resolve(__dirname, "../../database/welcome.json");

function lerDb() {
try {
if (fs.existsSync(dbPath)) {
return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}
} catch (e) {}
return {};
}

function salvarDb(dados) {
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(dbPath, JSON.stringify(dados, null, 2), "utf-8");
}

module.exports = {
nome: "bemvindo",
descricao: "Ativa『1』ou Desativa『0』o sistema de boas-vindas e define a mensagem por grupo",
categoria: "admin",
executar: async (ctx, args) => {
//Ⓣ Validação: Apenas em grupos
if (ctx.chat.type === "private") {
return await enviar(ctx, "⚠️ *Este comando só pode ser usado em grupos!*");
 }
//Ⓣ Validação: Apenas Administradores
try {
const membro = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
const ehAdmin = membro.status === "administrator" || membro.status === "creator";
if (!ehAdmin) {
return await enviar( ctx, "🚫 *ACESSO NEGADO!*\nApenas administradores podem configurar o boas-vindas.");
}
} catch (e) {
return await enviar(ctx, "❌ Erro ao verificar suas permissões.");
}
const db = lerDb();
const chatId = ctx.chat.id.toString();

if (!db[chatId]) {
db[chatId] = {
ativo: false,
texto: "👋 Olá {nome}, seja muito bem-vindo(a) ao grupo *{grupo}*!",
foto: null
};
}

const acao = args[0];

//Ⓣ ATIVAR 1
if (acao === "1") {
db[chatId].ativo = true;

//Ⓣ Se passou texto junto com o comando (/welcome 1 mensagem)
let novoTexto = args.slice(1).join(" ");
let fotoId = null;

if (ctx.message.photo && ctx.message.photo.length > 0) {
fotoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
if (ctx.message.caption) {
novoTexto = ctx.message.caption.replace(/\/welcome\s+1/i, "").trim();
}
}

if (novoTexto) db[chatId].texto = novoTexto;
if (fotoId) db[chatId].foto = fotoId;

salvarDb(db);

return await enviar( ctx,`✅ *Boas-Vindas ATIVADO『1』neste grupo!*\n\n` +
`💬 *Mensagem atual:*\n${db[chatId].texto}`
);
}
//Ⓣ DESATIVAR『0』
if (acao === "0") {
db[chatId].ativo = false;
//Ⓣ Se passou texto junto com o comando para alterar a mensagem enquanto deixa desativado
let novoTexto = args.slice(1).join(" ");
let fotoId = null;

if (ctx.message.photo && ctx.message.photo.length > 0) {
fotoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
if (ctx.message.caption) {
novoTexto = ctx.message.caption.replace(/\/welcome\s+0/i, "").trim();
}
}

if (novoTexto) db[chatId].texto = novoTexto;
if (fotoId) db[chatId].foto = fotoId;
salvarDb(db);

return await enviar(ctx, "🛑 *Boas-Vindas DESATIVADO『0』neste grupo!*");
}

//Ⓣ MENU DE AJUDA / STATUS ATUAL
const status = db[chatId].ativo ? "🟢 *Ativado『1』*" : "🔴 *Desativado『0』*";
const textoAtual = db[chatId].texto || "Padrão";

return await enviar( ctx,`⚙️ *SISTEMA DE BOAS-VINDAS*\n\n` +
`📌 *Status Atual:* ${status}\n\n` +
`💬 *Mensagem Atual do Grupo:*\n${textoAtual}\n\n` +
`🛠️ *Como usar:*\n` +
`• \`/bemvindo 1\` ➔ Ativa o boas-vindas\n` +
`• \`/bemvindo 0\` ➔ Desativa o boas-vindas\n` +
`• \`/bemvindo 1『mensagem』\` ➔ Ativa e define nova mensagem\n` +
`• \`/bemvindo 0『mensagem』\` ➔ Desativa e define nova mensagem\n\n` +
`💡 *Tags que você pode usar na mensagem:*\n` +
`• \`{nome}\` ➔ Nome do usuário\n` +
`• \`{grupo}\` ➔ Nome do grupo\n` +
`• \`{id}\` ➔ ID do usuário`
);
}
};