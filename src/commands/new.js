const trimAndLowerContent = require("../utils/trimAndLowerContent");

const getReply = async (channel, filter) => {
  const res = await channel.awaitMessages(filter, { max: 1, time: 60000 }); // Timeout in a minute
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
  // Questions
  const answers = new Map();
  // 1.
  await send("Is your position remote? `Yes/No`");
  const isRemote = await getReply(channel, filter);
  if (!isRemote) return send("Canceled");
  if (isRemote !== "yes" && isRemote !== "no")
    return send("Invalid answer provided. Canceling form.");
  answers.set("isRemote", isRemote);
  if (isRemote === "no") {
    // 1.5.
    await send(
      "Please, in a single message, provide a location if you can.\nIf you do not wish to reveal the location, answer simply with `no`"
    );
    const location = await getReply(channel, filter);
    if (!location) return send("Canceled");
    answers.set("location", location);
  }
  // 2.
  await send(
    "Please, in a single message, provide a short description of the job.\nIt may include details such as hours and languages/frameworks/specific tooling (such as JS, PHP, Wordpress, etc.)."
  );
  const desc = await getReply(channel, filter);
  if (!desc) return send("Canceled");
  answers.set("desc", desc);
  // 3.
  await send(
    "Please provide the amount that you are willing to pay for the project in USD `$`."
  );
  const compensation = await getReply(channel, filter);
  if (!compensation) return send("Canceled");
  const val = parseFloat(compensation);
  if (isNaN(val) || val < 1) return send("Invalid compensation."); // Alert the mods that a cheapskate is around
  answers.set("compensation", compensation);
  // 4.
  await send(
    "Almost done!\nAny further notes? E.g. contact information (DM, mail, other channels)."
  );
  const notes = await getReply(channel, filter);
  if (!notes) return send("Canceled");
  answers.set("notes", notes);
  return console.log(answers);
};
