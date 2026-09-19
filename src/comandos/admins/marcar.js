/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『NIER_SISTEM_MARCAR』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const { enviar } = require("../../utils");

module.exports = {
nome: "marcar",
descricao: "Notifica todos os membros do grupo usando a marcação geral nativa 『Apenas Admins』",
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
const legenda = args.length > 0 ? args.join(" ") : "Atenção a todos os membros!";
const msgStatus = await enviar(ctx, "⏳ *Puxando foto do grupo e disparando notificação geral...*");
try {
//Ⓣ Puxa a foto do grupo
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
//Ⓣ Monta o texto chamando a marcação nativa do Telegram (@all / @everyone)
let textoMarcacao = `🔔 *CHAMADA GERAL DO GRUPO*\n\n`;
textoMarcacao += `📝 *Mensagem:* ${legenda}\n\n`;
textoMarcacao += `📣 @all @everyone\n\n`;
textoMarcacao += `👤 *Administrador:* ${ctx.from.first_name}`;
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
//Ⓣ Envia a foto com legenda ou apenas texto caso falhe
if (urlFotoGrupo) {
try {
return await ctx.replyWithPhoto({ url: urlFotoGrupo }, opcoes);
} catch (errFoto) {
console.log("⚠️ Erro ao enviar com foto, enviando apenas em texto...");
}
}
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
return await enviar(ctx, "❌ Erro ao tentar marcar o grupo.");
}
}
};