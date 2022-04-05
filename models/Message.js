const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  conversationID: {
    type: String,
    ref: "conversation",
  },
  sender: {
    type: String,
    ref: "users",
  },
  text: {
    type: String,
  },
});

module.exports = mongoose.model("message", MessageSchema);
