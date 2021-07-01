const { model, Schema } = require("mongoose");

const multipleChoiceSchema = new Schema({
  exam: Number,
  header: String,
  subject: String,
  choices: [
    {
      header: String,
      status: Boolean,
      createdAt: String,
      updatedAt: String,
    },
  ],
  answerJustifications: [
    {
      header: String,
      status: Boolean,
      createdAt: String,
      updatedAt: String,
    },
  ],
  createdAt: String,
  updatedAt: String,
});

module.exports = model("MultipleChoice", multipleChoiceSchema);
