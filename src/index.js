const { Client } = require("discord.js");
const client = new Client();
const { token, keyword, channel } = require("./config");

const trimAndLowerContent = require("./utils/trimAndLowerContent");

const sanitizeInput = ({ cleanContent }) => trimAndLowerContent(cleanContent);

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
  const res = await commands[flag](msg);
  // If the new flag has been selected, emit a 'newJobPost' event with the data
  if (flag === "new") client.emit("newJobPost", res);
}

function handleNewJobPost({ answers, guild, username, discriminator }) {
  // Data is the answers map returned from the new command
  let response = `@${username}#${discriminator} has posted a new job.`;
  const targetChannel = guild.channels.cache.find(
    ({ name }) => name === channel
  );
  if (!targetChannel) console.error("Channel does not exist.");
  for (let [key, value] of answers) {
    response += "\n" + "```\n" + `${key}: ${value}` + "\n```";
  }
  targetChannel.send(response);
}

client.on("message", handleMessage);

client.on("newJobPost", handleNewJobPost);

client.on("ready", () => console.log(`${client.user.tag} logged in.`));

(async () => {
  try {
    await client.login(token);
  } catch (error) {
    console.error(error);
  }
})();
