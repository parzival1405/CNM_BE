const Conversation = require("../models/Conversation");
var mongoose = require("mongoose");

require("dotenv").config();
module.exports.getAllConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      member: { $in: [req.userId] },
    })
      .sort("updatedAt")
      .populate("member", "avatarURL username phoneNumber")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          model: "User",
          select: "username _id",
        },
      })
      .populate("createdBy", " _id username");
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports.createConversation = async (req, res) => {
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
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports.changeLabel = async (req, res) => {
  const {newLabel,conversationId} = req.body

  try {
    const conversation = await Conversation.findById(conversationId);
    if (conversation.label !== undefined) {
      await Conversation.findByIdAndUpdate(
        { _id: conversationId },
        {
          label: newLabel,
        },
        { new: true }
      );
    }

    res.status(200).json(await Conversation.findById(conversationId));
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error });
  }
};

module.exports.addMemberGroup= async (req, res) => {
  const { conversationId ,newMember} = req.body;

  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: conversationId },
      { $push: { member: {$each:newMember} } },
      { new: true }
    );
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports.deleteGroup= async (req, res) => {
  const {conversationId} = req.body;

  const user = req.userId;
  try {

    const c = await Conversation.findById({ _id: conversationId });
    if (c.createdBy == user) {
      await Conversation.findByIdAndDelete({ _id: conversationId });

      res.status(200).json({ msg: "Xóa nhóm chat thành công!" });
    } else {
      res
        .status(500)
        .json({ msg: "Chỉ có admin mới có quyền xóa nhóm chat" });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: error });
  }
};
module.exports.deleteMember= async (req, res) => {
  const userId = req.userId;
  const { conversationId,deleteMemberId } = req.body;

  try {
    const c = await Conversation.findById(conversationId);
    console.log(userId,c.createdBy)
    if (c.createdBy == userId) {
      const conversation = await Conversation.findByIdAndUpdate(
        { _id: conversationId },
        {
          $pull:{member :{$in : deleteMemberId}}
        },
        { new: true }
      );
      res.status(200).json(conversation);
    } else {
      return res
        .status(500)
        .json({ msg: "Chỉ có admin mới có quyền xóa thành viên" });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: error });
  }
};

module.exports.outGroup= async (req, res) => {
  const { conversationId } = req.body;
  const userId  = req.userId;

  try {
    const conversation = await Conversation.findByIdAndUpdate(
      { _id: conversationId },
      {
        $pull:{member : userId}
      },
      { new: true }
    );
    res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ errorMessage: error });
  }
};
