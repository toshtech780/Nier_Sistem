/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
    浤 🪽『NIER_SISTEM_MENU』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const { Markup } = require("telegraf");
const { enviar } = require("../../utils");
const { logoUrl } = require("../../config");
const { prefix, NomeDoBot } = require("../../config");

module.exports = {
nome: "start",
aliases: ["menu"],
categoria: "membros",
executar: async (ctx) => {
const { categorias } = require("../../plugin");
const nomeUsuario = ctx.from.first_name || "Membro";
const listaCategorias = Object.keys(categorias || {});

if (listaCategorias.length === 0) {
return await enviar(ctx, "⚠️ Nenhuma categoria encontrada!");
}

//Ⓣ Monta os botões das categorias de 2 em 2
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

//Ⓣ Botão de encerramento
botoes.push([Markup.callbackButton("❌ FECHAR MENU", "menu_fechar")]);

const mensagemMenu = 
`°◈°┈━━━━⊱✟${NomeDoBot}✟⊰━━━━┈°◈°

Olá, *『${nomeUsuario}』*! Seja bem-vindo『a』ao menu!
Meu prefixo é *『${prefix}』*

Selecione uma categoria abaixo para acessar os comandos:`;

try {
await ctx.replyWithPhoto(
{ url: logoUrl }, 
{ 
caption: mensagemMenu,
parse_mode: "Markdown",
...Markup.inlineKeyboard(botoes).extra()
}
);
} catch (err) {
await ctx.reply(mensagemMenu, {
parse_mode: "Markdown",
...Markup.inlineKeyboard(botoes).extra()
});
}
}
};