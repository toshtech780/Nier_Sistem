/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
 浤 🪽『MODULO TOSH TECH』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */

const axios = require("axios");
const https = require("https");
const { toshtech_site, toshtech_key } = require("./config");

//Ⓣ Tenta importar node-fetch para o fallback (compatível com Node 13+)
let fetchLib;
try {
fetchLib = require("node-fetch");
} catch (e) {
fetchLib = global.fetch;
}

//Ⓣ Configura Agent HTTPS persistente para reaproveitar os sockets『máxima velocidade』
const httpsAgent = new https.Agent({
keepAlive: true,
keepAliveMsecs: 10000,
maxSockets: 50,
rejectUnauthorized: false//Ⓣ Evita bloqueios de certificados no Termux
});

//Ⓣ Instância otimizada do Axios
const axiosInstance = axios.create({
baseURL: toshtech_site,
timeout: 12000,//Ⓣ Timeout de 12 segundos para não travar o bot
httpsAgent: httpsAgent,
headers: {
"User-Agent": "NierSistemBot/2.0",
"Accept": "application/json"
}
});
/**
 * Função principal para fazer requisições à Tosh Tech
 * @param {string} endpoint - Ex: "/api/download/play"
 * @param {object} params - Parâmetros da URL
 */
async function getApi(endpoint, params = {}) {
const queryParams = new URLSearchParams({
apikey: toshtech_key,
...params
}).toString();

const endpointFormatado = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

//Ⓣ TENTATIVA: AXIOS『Super Otimizado』
try {
const response = await axiosInstance.get(`${endpointFormatado}?${queryParams}`);
return response.data;
} catch (errAxios) {
console.log(`⚠️ Axios falhou em [${endpointFormatado}]: ${errAxios.message}. Ativando fallback Fetch...`);

//Ⓣ TENTATIVA: FALLBACK VIA FETCH 『Rede de segurança』
try {
const fullUrl = `${toshtech_site}${endpointFormatado}?${queryParams}`;
      
const fetchResponse = fetchLib 
? await fetchLib(fullUrl, { agent: httpsAgent, timeout: 12000 })
: await fetch(fullUrl);

if (!fetchResponse.ok) {
throw new Error(`HTTP Status ${fetchResponse.status}`);
}

const data = await fetchResponse.json();
return data;
} catch (errFetch) {
console.error(`❌ Erro definitivo na Tosh Tech [${endpointFormatado}]:`, errFetch.message);
throw errFetch;
}
}
}

module.exports = { getApi, apiBaseUrl: toshtech_site, apiKey: toshtech_key };