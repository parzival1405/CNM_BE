const Conversation = require("../models/Conversation");
var mongoose = require('mongoose');

require("dotenv").config();
module.exports.getAllConversation  = async (req, res) => {
  try {
    const conversation = await Conversation.find({member: { $in: [req.userId] }})
    .select("-updatedAt")
    .populate("member", "avatarURL username phoneNumber")
    .populate("lastMessage", "text updatedAt")
    .populate("createdBy", " _id username");
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong!"});
  }
};
