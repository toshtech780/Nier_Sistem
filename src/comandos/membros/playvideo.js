/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
    浤 🪽『NIER_SISTEM_VIDEO』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const { getApi, apiBaseUrl, apiKey } = require("../../api");
const { enviar } = require("../../utils");

module.exports = {
nome: "playvideo2",//Ⓣ Ou "video", como preferir chamar
aliases: ["ytmp4"],
executar: async (ctx, args) => {
if (!args || args.length === 0) {
return await enviar( ctx,"⚠️ Você precisa informar o nome ou título do vídeo!\nExemplo: `/playvideo Muleque de Vila`" );
}

const busca = args.join(" ");
try {
await enviar(ctx, `🔎 Buscando o vídeo『${busca}』na Tosh Tech...`);

//Ⓣ Busca os metadados do vídeo
const dataBusca = await getApi("/api/download/play", { nome: busca });
if (!dataBusca || !dataBusca.status || !dataBusca.dados) {
return await enviar( ctx,"❌ Não foi possível encontrar esse vídeo. Tente com outro nome!" );
}

const { titulo, title, canal, author, duration, timestamp, capa, image, thumbnail, url } = dataBusca.dados;

const tituloFinal = titulo || title || "Vídeo";
const canalFinal = canal || (author ? author.name : null) || "Tosh Tech";
const duracaoFinal = duration || timestamp || "Veio vazio";
const capaFinal = capa || image || thumbnail;
const youtubeUrl = url || dataBusca.dados.url;

const legendaInfo = 
`🎵 *『${tituloFinal}』*
👤 *『Canal:』* ${canalFinal}
⏱️ *『Duração:』* ${duracaoFinal}

⏳ *Enviando o vídeo...*`;

//Ⓣ Envia a foto da capa com as informações antes de enviar o vídeo
if (capaFinal) {
await ctx.replyWithPhoto(
{ url: capaFinal },
{ caption: legendaInfo, parse_mode: "Markdown" } 
);
} else {
await enviar(ctx, legendaInfo);
}
if (!youtubeUrl) {
return await enviar(ctx, "❌ Erro ao obter a URL do vídeo do YouTube.");
}

//Ⓣ Monta a URL direta de download do vídeo MP4 via playvdv2
const videoDirectUrl = `${apiBaseUrl}/api/download/playvdv2?url=${encodeURIComponent(youtubeUrl)}&apikey=${apiKey}`;

//Ⓣ Envia o vídeo MP4 no Telegram
try {
await ctx.replyWithVideo(
{ url: videoDirectUrl }, {
caption: `🎬 *${tituloFinal}*`,
parse_mode: "Markdown" }
);
 } catch (errVideo) {
console.log("Falha no envio como vídeo nativo, enviando como arquivo de documento...");
await ctx.replyWithDocument(
{ url: videoDirectUrl, filename: `${tituloFinal}.mp4` },
{ caption: `🎬 ${tituloFinal}` }
);
}
} catch (err) {
console.error("Erro no comando playvid:", err.message);
await enviar( ctx,"❌ Ocorreu um erro ao processar o vídeo. Tente novamente mais tarde!" );
}
}
};