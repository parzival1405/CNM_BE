const Messages = require("../models/message");
require("dotenv").config();

module.exports.addMessage = async (req, res, next) => {
  try {
    const { sender, conversation, text,type } = req.body;
    const data = await Messages.create({
      conversation: conversation._id,
      sender: sender,
      text: text,
      type:type
    }).then((data) => data.populate("sender", "_id avatarURL"));
    if (data) {
      return res.json({
        data: data,
      });
    }
    return res.json({ msg: "failed to add message " });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { conversation } = req.body;
    const messages = await Messages.find({
      conversation: conversation,
    })
      .select("-updatedAt")
      .sort({ updatedAt: 1 })
      .populate("sender", "_id avatarURL");

    return res.json({ data: messages });
  } catch (error) {
    next(error);
  }
};

//demo

module.exports.addMessageDemo = async (data, next) => {
  try {
    const { from, conversation, message } = data;
    const dataResult = await Messages.create({
      conversation: conversation,
      sender: from,
      text: message,
    }).then((data) => data.populate("sender", "_id avatarURL"));
    if (dataResult) {
      return {
        _id: dataResult._id,
        fromSelf: dataResult.sender._id.toString() === from,
        info: dataResult.sender,
        message: dataResult.text,
        msg: "message added",
      };
    }
    return res.json({ msg: "failed to add message " });
  } catch (error) {}
};

module.exports.getUnseenMessage = async (req, res, next) => {
  try {
    const id = req.userId;

    const unseenMessages = await Messages.aggregate([
      {
        $match: {
          $and: [{ users: { $all: [id] } }, { watched: { $ne: id } }],
        },
      },
      { $group: { _id: "$sender", count: { $count: {} } } },
    ]);

    const projectMessage = unseenMessages.map((msg) => {
      return {
        friend: msg._id,
        totalUnseenMessages: msg.count,
      };
    });

    return res.json({ data: projectMessage });
  } catch (error) {}
};
