const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  createdAt: String,
  role: String,
});

module.exports = model("User", userSchema);
