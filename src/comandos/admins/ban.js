/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『NIER_SISTEM_BAN』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const { enviar } = require("../../utils");

module.exports = {
nome: "ban",
descricao: "Bane um participante por resposta, marcação『@』ou ID『Apenas Admins』",
categoria: "admin",
executar: async (ctx, args) => {
//Ⓣ Validação: Só funciona em grupos
if (ctx.chat.type === "private") {
return await enviar(ctx, "⚠️ *Este comando só pode ser usado em grupos!*");
}
//Ⓣ Validação: Checa se quem mandou o comando é Administrador
try {
const autor = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
const ehAdmin = autor.status === "administrator" || autor.status === "creator";

if (!ehAdmin) {
return await enviar( ctx,"🚫 *ACESSO NEGADO!*\nApenas administradores do grupo podem banir membros.");
}
} catch (e) {
return await enviar( ctx, "❌ Erro ao verificar suas permissões no grupo.");
}
let idAlvo = null;
let nomeAlvo = "Usuário";
//Ⓣ Identifica o usuário a ser banido
//Ⓣ Forma 1: Respondendo à mensagem do usuário
if (ctx.message.reply_to_message) {
idAlvo = ctx.message.reply_to_message.from.id;
nomeAlvo = ctx.message.reply_to_message.from.first_name || "Usuário";
}
//Ⓣ Forma 2: Marcando o usuário via Entidades do Telegram (@usuario ou clique na marcação)
else if (ctx.message.entities && ctx.message.entities.length > 1) {
const entities = ctx.message.entities;

for (let i = 0; i < entities.length; i++) {
const ent = entities[i];

//Ⓣ Marcação sem username『quando clica e seleciona a pessoa』
if (ent.type === "text_mention" && ent.user) {
idAlvo = ent.user.id;
nomeAlvo = ent.user.first_name || "Usuário";
break;
}
//Ⓣ Marcação por @username público
if (ent.type === "mention") {
const usernameMarcado = ctx.message.text.substring(ent.offset, ent.offset + ent.length);
try {
//Ⓣ Busca os dados do membro no grupo pelo @username
const membros = await ctx.telegram.getChatAdministrators(ctx.chat.id);
//Ⓣ Procura na lista de admins ou via requisição
const encontrado = membros.find(function(m) {
return m.user.username && `@${m.user.username.toLowerCase()}` === usernameMarcado.toLowerCase();
});

if (encontrado) {
idAlvo = encontrado.user.id;
nomeAlvo = encontrado.user.first_name || usernameMarcado;
} else {
nomeAlvo = usernameMarcado;
}
} catch (e) {}
break;
}
}
}
//Ⓣ Forma 3: Digitando o ID numérico diretamente (/ban 123456789)
if (!idAlvo && args.length > 0 && !isNaN(args[0])) {
idAlvo = parseInt(args[0], 10);
}
//Ⓣ Se ainda não encontrou o alvo
if (!idAlvo) {
return await enviar( ctx,`⚠️ *Como usar o comando ban:*\n\n` +
`1⚜ *Respondendo à mensagem:*
└ Responda o membro com \`/ban\`\n\n` +
`2⚜ *Marcando o membro:*
└ \`/ban @usuario\`\n\n` +
`3⚜ *Pelo ID numérico:*
└ \`/ban 123456789\``
);
}

//Ⓣ Validações de segurança
const botInfo = await ctx.telegram.getMe();
if (idAlvo === botInfo.id) {
return await enviar(ctx, "❌ *Eu não posso me banir!*");
}

if (idAlvo === ctx.from.id) {
return await enviar(ctx, "❌ *Você não pode banir a si mesmo!*");
}
//Ⓣ Verificar se o alvo é admin do grupo
try {
const membroAlvo = await ctx.telegram.getChatMember(ctx.chat.id, idAlvo);
if (membroAlvo.status === "administrator" || membroAlvo.status === "creator") {
return await enviar(ctx, "🚫 *Não é possível banir outro Administrador ou Criador do grupo!*");
}
} catch (e) {
//Ⓣ Segue adiante caso a checagem falhe
}
//Ⓣ Executa o Banimento no Telegram
try {
await ctx.telegram.kickChatMember(ctx.chat.id, idAlvo);
return await ctx.replyWithMarkdown(
`🔨 *MEMBRO BANIDO COM SUCESSO!*\n\n` +
`👤 *Usuário:* [${nomeAlvo}](tg://user?id=${idAlvo})\n` +
`🆔 *ID:* \`${idAlvo}\`\n` +
`👮 *Aplicado por:* ${ctx.from.first_name}`
);
} catch (err) {
console.error("❌ Erro ao banir membro:", err.message);
return await enviar( ctx,`❌ *Falha ao banir o usuário.*\n\n` +
`_Certifique-se de que o bot é Administrador no grupo com a permissão de Banir Usuários e que o ID/Marcação seja válido._` );
}
}
};