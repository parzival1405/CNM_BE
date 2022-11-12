const User = require("../models/User");
var mongoose = require("mongoose");

require("dotenv").config();

module.exports.getAllFriends = async (req, res) => {
  try {
    const Users = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "friends",
          foreignField: "_id",
          as: "friends",
        },
      },
      { $project: { friends: 1, _id: 0 } },
    ]);

    const Users2 = Users[0].friends.map((friend) => {
      const { avatarURL, username, phoneNumber, _id } = friend;
      return { avatarURL, username, phoneNumber, _id };
    });

    return res.status(200).json(Users2);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

module.exports.getUserByPhonenumber = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const existingUser = await User.findOne({
      $and: [{ phoneNumber }],
    }).populate("friends friendsQueue", "username avatarURL phoneNumber _id");

    return res.status(200).json(existingUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

module.exports.requestAddFriend = async (req, res) => {
  const { userId } = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { friendsQueue: mongoose.Types.ObjectId(req.userId) } }
    );

    return res.status(200).json("requestAddFriend success");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

module.exports.updateProfile = async (req, res) => {
  const userId = req.userId;
  const { username, avatarURL, gender, dob } = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: userId },
      { username, avatarURL, gender, dob }
    );

    return res.status(200).json("update success");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

module.exports.acceptFriend = async (req, res) => {
  const userId = req.userId;
  const { acceptFriendId } = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: { friends: acceptFriendId },
        $pull: { friendsQueue: acceptFriendId }
      }
    );

    await User.findOneAndUpdate(
      { _id: acceptFriendId },
      {
        $push: { friends: userId },
      }
    );

    const user = await User.findOne(
      { _id: userId }
    ).populate(
      "friends friendsQueue",
      "username avatarURL phoneNumber _id"
    );
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(500).json({
        message: "Something went wrong!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

module.exports.deniedFriend = async (req, res) => {
  const userId = req.userId;
  const { deniedFriendId } = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { friendsQueue: deniedFriendId }
      }
    );
    const user = await User.findOne(
      { _id: userId }
    ).populate(
      "friends friendsQueue",
      "username avatarURL phoneNumber _id"
    );
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(500).json({
        message: "Something went wrong!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

module.exports.deleteFriend = async (req, res) => {
  const userId = req.userId;
  const { deleteFriendId } = req.body;
  try {
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { friends: deleteFriendId }
      }
    );

    await User.findOneAndUpdate(
      { _id: deleteFriendId },
      {
        $pull: { friends: userId }
      }
    );

    const user = await User.findOne(
      { _id: userId }
    ).populate(
      "friends friendsQueue",
      "username avatarURL phoneNumber _id"
    );
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(500).json({
        message: "Something went wrong!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

// Get list request Friends
module.exports.getAllFriendsQueue = async (req, res) => {
  try {
    const Users = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "friendsQueue",
          foreignField: "_id",
          as: "friendsQueue",
        },
      },
      { $project: { friendsQueue: 1, _id: 0 } },
    ]);
    const Users2 = Users[0].friendsQueue.map((friend) => {
      const { avatarURL, username, phoneNumber, _id } = friend;
      return { avatarURL, username, phoneNumber, _id };
    });

    return res.status(200).json(Users2);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};
