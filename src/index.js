const { Client } = require("discord.js");
const client = new Client();
const { token, keyword } = require("./config");

const sanitizeInput = ({ cleanContent }) =>
  cleanContent.trim().replace(/\n/gim, " ").toLowerCase();

const getCommands = require("./commands");

async function handleMessage(msg) {
  const input = sanitizeInput(msg);
  // Bail if the message does not start with the keyword
  if (!input.startsWith(keyword)) return;
  const commands = await getCommands();
  const [_, flag] = input.split(" ");
  // Bail if the command does not exist.
  if (!commands[flag]) return;
  // Pipe the message into the command.
  commands[flag](msg);
}

client.on("message", handleMessage);

client.on("ready", () => console.log(`${client.user.tag} logged in.`));

(async () => {
  try {
    await client.login(token);
  } catch (error) {
    console.error(error);
  }
})();
