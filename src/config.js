require("dotenv").config();

module.exports = {
  token: process.env.TOKEN,
  keyword: "!post",
  channel: process.env.TARGET_CHANNEL,
};
