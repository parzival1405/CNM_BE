const User = require("../models/user.js");
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

    const Users2 = Users[0].friends.map(friend => {
      const {avatarURL,username,phoneNumber,_id} = friend
      return {avatarURL,username,phoneNumber,_id}
    }) 

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
    const existingUser = await User.findOne({ $and:[{phoneNumber},{_id:{$ne:mongoose.Types.ObjectId(req.userId)}}] });

    return res.status(200).json(existingUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};
