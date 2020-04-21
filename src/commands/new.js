const trimAndLowerContent = require("../utils/trimAndLowerContent");

const getReply = async (channel, filter) => {
  const res = await channel.awaitMessages(filter, { max: 1, time: 60000 }); // Timeout in a minute
  const content = trimAndLowerContent(res.first().content);
  return content === "cancel" ? false : content;
};

const questions = require("../questions");

module.exports = async (msg) => {
  const filter = (m) => m.author.id === msg.author.id;
  const send = (str) => msg.author.send(str);
  const { guild } = msg;
  const { username, discriminator } = msg.author;
  // Notify the user regarding the rules, and get the channel
  const { channel } = await send(
    "Heads up!\nPosts without financial compensation are not allowed. This includes any kind of equity. Trying to circumvent this in any way will result in a ban.\nIf you are not willing to continue, type `cancel`.\nOtherwise, type `ok` to continue."
  );
  const proceed = await getReply(channel, filter);
  if (!proceed)
    // Bail if the user explicitly cancels the form.
    return send("Canceled.");
  const answers = new Map();
  // Iterate over questions
  for (const key in questions) {
    // Check if the current question is the location question
    if (key === "location") {
      // Check if the `isRemote` value has been set to "yes"
      const isRemote = answers.get("isRemote");
      // If the value is set to "yes", skip this iteration
      if (isRemote === "yes") continue;
    }
    const q = questions[key];
    // Send out the question
    await send(q.body);
    // Await the input
    const reply = await getReply(channel, filter);
    // If the reply is equal to "cancel", cancel the form
    if (reply === "cancel")
      return await send("Explicitly cancelled job post form. Exiting...");
    // If there is a validation method appended to the question, use it
    if (!q.validate) {
      answers.set(key, reply);
      continue;
    }
    // If the input is not valid, cancel the form and notify the user.
    const isValid = q.validate(reply);
    if (!isValid) return await send("Invalid input. Cancelling form.");
    // Otherwise, store the answer in the output map
    answers.set(key, reply);
  }
  return { answers, guild, username, discriminator };
};
