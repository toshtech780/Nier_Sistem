/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
    浤 🪽『NIER_SISTEM_AUDIO』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const { getApi, apiBaseUrl, apiKey } = require("../../api");
const { enviar } = require("../../utils");

module.exports = {
nome: "play2",//Ⓣ Ou "play", como preferir chamar
aliases: ["ytmp3"],
executar: async (ctx, args) => {
if (!args || args.length === 0) {
return await enviar( ctx,"⚠️ Você precisa informar o nome da música!\nExemplo: `/play Muleque de Vila`" );
}

const busca = args.join(" ");
try {
await enviar(ctx, `🔎 Buscando a música『${busca}』na Tosh Tech API...`);

//Ⓣ Busca os metadados da música
const dataBusca = await getApi("/api/download/play", { nome: busca });

if (!dataBusca || !dataBusca.status || !dataBusca.dados) {
return await enviar( ctx,"❌ Não foi possível encontrar essa música. Tente com outro nome!" );
}

const { titulo, title, canal, author, duration, timestamp, capa, image, thumbnail, url } = dataBusca.dados;

const tituloFinal = titulo || title || "Música";
const canalFinal = canal || (author ? author.name : null) || "Tosh Tech";
const duracaoFinal = duration || timestamp || "Veio vazio";
const capaFinal = capa || image || thumbnail;
const youtubeUrl = url || dataBusca.dados.url;

const legendaInfo = 
`🎵 *『${tituloFinal}』*
👤 *『Canal:』* ${canalFinal}
⏱️ *『Duração:』* ${duracaoFinal}

⏳ *Enviando o áudio...*`;
//Ⓣ Envia a imagem da capa com a legenda detalhada
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

//Ⓣ Como a rota playv2 RETORNA O MP3 DIRETO, geramos o link direto
const audioDirectUrl = `${apiBaseUrl}/api/download/playv2?url=${encodeURIComponent(youtubeUrl)}&apikey=${apiKey}`;

//Ⓣ ETAPA: Passa a URL direta da playv2 para o Telegram baixar
try {
await ctx.replyWithAudio(
{ url: audioDirectUrl },
{ title: tituloFinal, performer: canalFinal }
);
} catch (errAudio) {
console.log("Falha no envio do áudio nativo, enviando como arquivo MP3...");
await ctx.replyWithDocument(
{ url: audioDirectUrl, filename: `${tituloFinal}.mp3` },
{ caption: `🎵 ${tituloFinal}` }
);
}
} catch (err) {
console.error("Erro no comando play:", err.message);
await enviar( ctx,"❌ Ocorreu um erro ao processar a música. Tente novamente mais tarde!" );
}
}
};