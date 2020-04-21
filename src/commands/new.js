const trimAndLowerContent = require("../utils/trimAndLowerContent");

const getReply = async (channel, filter) => {
  const res = await channel.awaitMessages(filter, { max: 1, time: 10000 });
  const content = trimAndLowerContent(res.first().content);
  return content === "cancel" ? false : content;
};

module.exports = async (msg) => {
  const filter = (m) => m.author.id === msg.author.id;
  const send = (str) => msg.author.send(str);
  // Notify the user regarding the rules, and get the channel
  const { channel } = await send(
    "Heads up!\nPosts without financial compensation are not allowed. This includes any kind of equity. Trying to circumvent this in any way will result in a ban.\nIf you are not willing to continue, type `cancel`.\nOtherwise, type `ok` to continue."
  );
  const proceed = await getReply(channel, filter);
  if (!proceed)
    // Bail if the user explicitly cancels the form.
    return send("Canceled.");
};
