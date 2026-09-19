/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『NIER_SISTEM_LIMPAR』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const { enviar } = require("../../utils");

module.exports = {
nome: "limpar",
descricao: "Apaga uma quantidade específica de mensagens no grupo 『Apenas Admins』",
categoria: "admin",
executar: async (ctx, args) => {
//Ⓣ Validação: Só funciona em grupos
if (ctx.chat.type === "private") {
return await enviar(ctx, "⚠️ *Este comando só pode ser usado em grupos!*");
}
//Ⓣ Validação: Checa se quem enviou o comando é Administrador do grupo
try {
const membro = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
const ehAdmin = membro.status === "administrator" || membro.status === "creator";

if (!ehAdmin) {
return await enviar(ctx, "🚫 *ACESSO NEGADO!*\nApenas administradores do grupo podem usar este comando.");
}
} catch (e) {
return await enviar(ctx, "❌ Erro ao verificar suas permissões no grupo.");
}
//Ⓣ Validação: Quantidade de mensagens informada
const quantidade = parseInt(args[0], 10);
if (!quantidade || isNaN(quantidade) || quantidade <= 0) {
return await enviar( ctx,`⚠️ *Como usar o comando limpar:*\n\n` +
`└ \`/limpar 10\` (Apaga as últimas 10 mensagens)\n` +
`└ \`/limpar 50\` (Apaga as últimas 50 mensagens)\n\n` +
`📌 *Nota:* O limite máximo recomendado por uso é *100* mensagens.` );
}
//Ⓣ Limite máximo para evitar travamentos
const limite = quantidade > 100 ? 100 : quantidade;
const msgComandoId = ctx.message.message_id;
//Ⓣ Tenta apagar a mensagem do próprio comando primeiro
try {
await ctx.deleteMessage(msgComandoId);
} catch (e) {}

let apagadas = 0;
//Ⓣ Loop regressivo apagando as mensagens anteriores
for (let i = 0; i < limite; i++) {
const idParaApagar = msgComandoId - i - 1;
try {
await ctx.telegram.deleteMessage(ctx.chat.id, idParaApagar);
apagadas++;
} catch (err) {
//Ⓣ Erros comuns: Mensagem com mais de 48h ou bot sem permissão de admin
}
}
//Ⓣ Envia mensagem informando o resultado e apaga ela após 5 segundos
const msgSucesso = await ctx.replyWithMarkdown(
`🧹 *Faxina Concluída!*\n\n` +
`✅ *${apagadas}* mensagens foram apagadas com sucesso do histórico.`
);

setTimeout(async function() {
try {
await ctx.telegram.deleteMessage(ctx.chat.id, msgSucesso.message_id);
} catch (e) {}
}, 5000);
}
};