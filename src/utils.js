/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『NIER_SISTEM_UTILS』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
async function enviar(ctx, msg) {
try {
return await ctx.reply(msg, { parse_mode: "Markdown" });
} catch (err) {
//Ⓣ Se falhar o parse do Markdown, tenta enviar em texto puro
try {
return await ctx.reply(msg);
} catch (errFallback) {
console.log("Erro ao enviar mensagem:", errFallback.message);
}
}
}

module.exports = { enviar };