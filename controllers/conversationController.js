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

module.exports.createConversation = async (req,res) => {
  const newConversation = new Conversation({
    label: req.body.label,
    member: req.body.member,
    createdBy: req.body.createdBy,
  });

  try {
    const savedConversation = await newConversation.save();
    const conversation = await Conversation.findById({
      _id: savedConversation._id,
    })
      .select("-updatedAt")
      .populate("member", "avatarURL username phoneNumber")
      // .populate("lastMessage", "text updatedAt")
      .populate("createdBy", " _id username");

    res.status(200).json(conversation);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong!"});
  }
}
