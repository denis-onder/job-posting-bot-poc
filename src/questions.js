const isEmpty = require("./utils/isEmpty");

module.exports = {
  isRemote: {
    body: "Is your position remote? `Yes/No`",
    validate: (answer) => {
      const acceptableResults = ["yes", "no"];
      return acceptableResults.includes(answer);
    },
  },
  location: {
    body:
      "Please, in a single message, provide a location if you can.\nIf you do not wish to reveal the location, answer simply with `no`",
    validate: isEmpty,
  },
  desc: {
    body:
      "Please, in a single message, provide a short description of the job.\nIt may include details such as hours and languages/frameworks/specific tooling (such as JS, PHP, Wordpress, etc.).",
    validate: isEmpty,
  },
  compensation: {
    body:
      "Please provide the amount that you are willing to pay for the project in USD `$`.",
    validate: (answer) =>
      /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,9})?)$/.test(
        parseFloat(answer.split("$").join("")).toFixed(2)
      ),
  },
  notes: {
    body:
      "Almost done!\nAny further notes? E.g. contact information (DM, mail, other channels).",
  },
};
