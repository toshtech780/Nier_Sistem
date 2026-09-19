/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『NIER_SISTEM_REINICIAR』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const { enviar } = require("../../utils");
const { idDono, NickDono, NomeDoBot, prefix } = require("../../config");

module.exports = {
nome: "reiniciar",
aliases: ["restart"],
descricao: "Reinicia o bot『Exclusivo para o dono』",
categoria: "dono",
executar: async (ctx, args) => {
const idUsuarioStr = ctx.from.id.toString();
const idDonoStr = idDono ? idDono.toString() : "";
const usernameAtual = ctx.from.username ? `@${ctx.from.username}` : "";
//Ⓣ Trava De Segurança Do Dono Compara o ID numérico do remetente com o idDono ou verifica pelo NickDono
const ehDono =
(idDonoStr && idUsuarioStr === idDonoStr) ||
(NickDono && usernameAtual.toLowerCase() === NickDono.toLowerCase()) ||
(NickDono && ctx.from.first_name.toLowerCase() === NickDono.toLowerCase());

if (!ehDono) {
return await enviar( ctx,"🚫 *ACESSO NEGADO!*\nApenas o meu criador/dono tem permissão para reiniciar o sistema." );
}
//Ⓣ Mensagem De Reinicialização
await enviar( ctx,`🔄 *『${NomeDoBot || "NIER SYSTEM"}』*\n\nSolicitação de reinicialização recebida.\nEncerrando o processo para aplicar atualizações...`
);

console.log(`\n⚠️『SISTEMA』Reinício solicitado pelo dono: ${ctx.from.first_name} (${idUsuarioStr})`);
//Ⓣ Aguarda 1.5 segundo para a mensagem ser enviada no Telegram antes de fechar
setTimeout(() => {
process.exit(0);
}, 1500);
}
};