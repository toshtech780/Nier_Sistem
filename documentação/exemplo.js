/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
    浤 🪽『COMANDO EXEMPLO』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */

const { enviar } = require("../../utils");

module.exports = {
//Ⓣ Nome principal do comando (sem a barra "/") [OBRIGATÓRIO]
nome: "exemplo",

//Ⓣ Apelidos/atalhos para ativar o mesmo comando [OPCIONAL]
aliases: ["ex", "teste"],

//Ⓣ Breve descrição do que o comando faz [OPCIONAL]
descricao: "Comando de exemplo da documentação",

//Ⓣ Função principal de execução [OBRIGATÓRIO]
executar: async (ctx, args) => {
try {

//Ⓣ Pega o texto digitado após o comando
const texto = args.join(" ");

if (!texto) {
return await enviar(ctx, "⚠️ *Uso correto:* /exemplo [sua mensagem]");
}

await enviar(ctx, `✅ *Você digitou:* ${texto}`);

} catch (err) {
console.error("Erro no comando exemplo:", err);
await enviar(ctx, "❌ Ocorreu um erro ao processar o comando.");
}
}
};