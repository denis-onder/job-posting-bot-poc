const { Client } = require("discord.js");
const client = new Client();
const { token, keyword } = require("./config");

client.on("ready", () => console.log(`${client.user.tag} logged in.`));

(async () => {
  try {
    await client.login(token);
  } catch (error) {
    console.error(error);
  }
})();
