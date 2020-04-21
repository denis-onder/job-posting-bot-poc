const fs = require("fs");

module.exports = async () => {
  let commands = {};
  const files = await fs.readdirSync(__dirname).filter((v) => v !== "index.js");
  files.forEach((f) => (commands[f.replace(".js", "")] = require(`./${f}`)));
  return commands;
};
