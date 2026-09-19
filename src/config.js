/*⊰༺⊱┈──╌浤 ᵗᵒˢʰ 浤╌──┈⊰༻⊱,
 -ˋˏ *༻Ⓣ༺ ˎˊᵗᵉᶜʰˋˏ ༻Ⓣ༺* ˎˊ-
浤 🪽『CONFIGURAÇOES DONO』 🪽︎︎︎浤
*浤.° ══━━━༺Ⓣ༻━━━══ °.浤* 
*᪥.◦,浤°.✽✦✽. 🍙 .✽✦✽.°浤,°.᪥*    */
const fs = require("fs");
const path = require("path");

const configPath = path.resolve(__dirname, "../dono/config.json");

if (!fs.existsSync(configPath)) {
console.log("⚠️  Arquivo de configuração não encontrado (dono/config.json)");
process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

module.exports = config;