/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『NIER_SISTEM_GRUPOS』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const fs = require("fs");
const path = require("path");
const { enviar } = require("../../utils");
const config = require("../../config");

module.exports = {
nome: "grupos",
aliases: ["lista"],
descricao: "Lista a quantidade e os nomes dos grupos onde o bot está『Apenas Dono』",
categoria: "dono",
executar: async (ctx, args) => {
const idUsuarioStr = ctx.from.id.toString();
const idDonoStr = config.idDono ? config.idDono.toString() : "";
const usernameAtual = ctx.from.username ? `@${ctx.from.username}` : "";
//Ⓣ Validação De Permissão Do Dono
const ehDono =
(idDonoStr && idUsuarioStr === idDonoStr) ||
(config.NickDono && usernameAtual.toLowerCase() === config.NickDono.toLowerCase()) ||
(config.NickDono && ctx.from.first_name.toLowerCase() === config.NickDono.toLowerCase());

if (!ehDono) {
return await enviar(ctx, "🚫 *ACESSO NEGADO!*\nApenas o dono pode ver a lista de grupos.");
}
//Ⓣ Caminho onde o bot costuma salvar os grupos
const dbPath = path.resolve(__dirname, "../../database/grupos.json");

let listaGrupos = [];
try {
if (fs.existsSync(dbPath)) {
listaGrupos = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}
} catch (err) {
console.error("❌ Erro ao ler base de dados de grupos:", err.message);
}
//Ⓣ Se o banco estiver vazio, adiciona pelo menos o grupo atual se o comando foi enviado lá
if (ctx.chat.type !== "private") {
const grupoAtualId = ctx.chat.id;
const grupoAtualNome = ctx.chat.title || "Grupo sem nome";
//Ⓣ Verifica se já está salvo, senão adiciona
const jaExiste = listaGrupos.find(function(g) { return g.id === grupoAtualId; });
if (!jaExiste) {
listaGrupos.push({ id: grupoAtualId, name: grupoAtualNome });
//Ⓣ Salva atualizado
const dirDb = path.dirname(dbPath);
if (!fs.existsSync(dirDb)) {
fs.mkdirSync(dirDb, { recursive: true });
}
fs.writeFileSync(dbPath, JSON.stringify(listaGrupos, null, 2), "utf-8");
}
}

if (!listaGrupos || listaGrupos.length === 0) {
return await enviar( ctx,`📊 *STATUS DE GRUPOS*\n\nNenhum grupo registrado no banco de dados ainda. Interaja com o bot em um grupo para registrá-lo!` );
}
//Ⓣ Monta a listagem formatada
let textoResposta = `📊 *GRUPOS CONECTADOS*\n\n`;
textoResposta += `📦 *Total de Grupos:* \`${listaGrupos.length}\`\n\n`;
textoResposta += `📋 *Lista de Nomes:*\n`;

listaGrupos.forEach(function(grupo, index) {
 textoResposta += `${index + 1}. *${grupo.name || "Desconhecido"}*『\`${grupo.id}\`』\n`;
});

return await enviar(ctx, textoResposta);
}
};