/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『NIER_SISTEM_MARCAR_ADM』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const { enviar } = require("../../utils");

module.exports = {
nome: "admins",
descricao: "Menciona os administradores do grupo e envia com a imagem do grupo『Apenas Admins』",
categoria: "admin",
executar: async (ctx, args) => {
//Ⓣ Validação: Só funciona em grupos
if (ctx.chat.type === "private") {
return await enviar(ctx, "⚠️ *Este comando só pode ser usado em grupos!*");
}
//Ⓣ Validação: Checa se quem enviou o comando é Administrador
try {
const membro = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
const ehAdmin = membro.status === "administrator" || membro.status === "creator";
if (!ehAdmin) {
return await enviar(ctx, "🚫 *ACESSO NEGADO!*\nApenas administradores podem marcar o grupo.");
}
} catch (e) {
return await enviar(ctx, "❌ Erro ao verificar suas permissões no grupo.");
}
const legenda = args.length > 0 ? args.join(" ") : "📢 *CHAMANDO TODOS ADMINS!*";
const msgStatus = await enviar(ctx, "⏳ *Puxando foto do grupo e preparando marcação dos administradores...*");
try {
//Ⓣ Puxa o link da foto do grupo
let urlFotoGrupo = null;
try {
const chatInfo = await ctx.telegram.getChat(ctx.chat.id);
if (chatInfo.photo && chatInfo.photo.big_file_id) {
const link = await ctx.telegram.getFileLink(chatInfo.photo.big_file_id);
urlFotoGrupo = link.href || link.toString();
}
} catch (e) {
console.log("⚠️ Não foi possível carregar a imagem do grupo:", e.message);
}
//Ⓣ Coleta os administradores do grupo
const admins = await ctx.telegram.getChatAdministrators(ctx.chat.id);
let textoMarcacao = `🔔 *CHAMANDO TODOS ADMINS*\n\n`;
textoMarcacao += `📝 *Mensagem:* ${legenda}\n\n`;
textoMarcacao += `👥 *Admins Mencionados:*\n`;
admins.forEach((admin, index) => {
const nome = admin.user.first_name || "administradores";
textoMarcacao += `${index + 1}. [${nome}](tg://user?id=${admin.user.id})\n`;
});
textoMarcacao += `\n📣 *Administrador:* ${ctx.from.first_name}`;
//Ⓣ Apaga mensagem de progresso
try {
await ctx.telegram.deleteMessage(ctx.chat.id, msgStatus.message_id);
} catch (e) {}
const opcoes = {
caption: textoMarcacao,
parse_mode: "Markdown"
};
if (ctx.message.reply_to_message) {
opcoes.reply_to_message_id = ctx.message.reply_to_message.message_id;
}
//Ⓣ Tenta enviar com a foto do grupo ({ url: ... }); se falhar, envia apenas o texto
if (urlFotoGrupo) {
try {
return await ctx.replyWithPhoto({ url: urlFotoGrupo }, opcoes);
} catch (errFoto) {
console.log("⚠️ Erro ao enviar com foto do grupo, enviando em texto simples...");
}
}
//Ⓣ Fallback: Envia apenas em texto se não houver foto ou se o envio da foto der erro
if (ctx.message.reply_to_message) {
return await ctx.replyWithMarkdown(textoMarcacao, {
reply_to_message_id: ctx.message.reply_to_message.message_id
});
}
return await ctx.replyWithMarkdown(textoMarcacao);
} catch (err) {
console.error("❌ Erro ao executar o comando marcar:", err.message);
try {
await ctx.telegram.deleteMessage(ctx.chat.id, msgStatus.message_id);
} catch (e) {}
return await enviar(ctx, "❌ Erro ao tentar marcar as pessoas do grupo.");
}
}
};