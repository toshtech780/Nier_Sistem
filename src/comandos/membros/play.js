/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
    浤 🪽『NIER_SISTEM_MIDIA』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const { Markup } = require("telegraf");
const { getApi } = require("../../api");
const { enviar } = require("../../utils");
const { prefix, NomeDoBot } = require("../../config");

function extrairVideoId(url) {
if (!url) return null;
const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
return match ? match[1] : null;
}

module.exports = {
nome: "play",
descricao: "Pesquisa e baixa músicas ou vídeos via botões interativos",
categoria: "membros",
executar: async (ctx, args) => {
if (!args || args.length === 0) {
return await enviar(ctx, `⚠️ Você precisa informar o nome da música ou vídeo!\nExemplo: ${prefixo}play Muleque de Vila`);
}

const busca = args.join(" ");
try {
await enviar(ctx, `🔎 Buscando『${busca}』na Tosh Tech API...`);

const dataBusca = await getApi("/api/download/play", { nome: busca });

if (!dataBusca || !dataBusca.status || !dataBusca.dados) {
return await enviar(ctx, "❌ Não foi possível encontrar esse conteúdo. Tente com outro nome!");
}

const { titulo, title, canal, author, duration, timestamp, capa, image, thumbnail, url } = dataBusca.dados;

const tituloFinal = titulo || title || "Conteúdo";
const canalFinal = canal || (author ? author.name : null) || "Tosh Tech";
const duracaoFinal = duration || timestamp || "Desconhecida";
const capaFinal = capa || image || thumbnail;
const youtubeUrl = url || dataBusca.dados.url;

if (!youtubeUrl) {
return await enviar(ctx, "❌ Erro ao obter a URL do vídeo do YouTube.");
}

const videoId = extrairVideoId(youtubeUrl);
const payload = videoId || youtubeUrl;
const payloadHex = Buffer.from(payload, "utf-8").toString("hex");

const legendaInfo = 
`🎵 *『${tituloFinal}』*
👤 *『Canal:』* ${canalFinal}
⏱️ *『Duração:』* ${duracaoFinal}

*『Escolha o formato que deseja baixar:』*`;

const botoes = Markup.inlineKeyboard([
[
Markup.callbackButton("🎵Áudio『MP3』", `dl_aud_${payloadHex}`),
Markup.callbackButton("🎬Vídeo『MP4』", `dl_vid_${payloadHex}`)
],
[
Markup.callbackButton("❌ FECHAR MENU", "menu_fechar")
]
]).extra();

if (capaFinal) {
await ctx.replyWithPhoto(
{ url: capaFinal },
{ caption: legendaInfo, parse_mode: "Markdown", ...botoes }
);
} else {
await ctx.replyWithMarkdown(legendaInfo, botoes);
}

} catch (err) {
console.error("Erro no comando play botão:", err.message);
await enviar(ctx, "❌ Ocorreu um erro ao processar o conteúdo.");
}
}
};