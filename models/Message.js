const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    conversation: { type: mongoose.Types.ObjectId, ref: "Conversation" },
    sender: { type: mongoose.Types.ObjectId, ref: "User" },
    text: String,
    type:{type:String,require:true}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);
