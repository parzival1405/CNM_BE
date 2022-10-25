const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.js");

require("dotenv").config();

module.exports.signin = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({ phoneNumber }).populate(
      "friends friendsQueue",
      "username avatarURL phoneNumber"
    );

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Số điện thoại chưa được đăng ký",errorCode:1 });
    }

    const isCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isCorrect) {
      return res.status(400).json({ message: "Sai mật khẩu",errorCode:2 });
    }

    const token = jwt.sign(
      { phoneNumber: existingUser.phoneNumber, id: existingUser._id },
      "test",
      { expiresIn: "5h" }
    );

    res.status(200).json({ user: existingUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports.signup = async (req, res) => {
  const { password, username, phoneNumber } = req.body;
  const avatarURL =
    "https://scontent.fsgn5-11.fna.fbcdn.net/v/t39.30808-6/310229638_1559528767795246_3641942269697383784_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=-mx7WAVAeZAAX-zKKDr&_nc_ht=scontent.fsgn5-11.fna&oh=00_AT_heJ226LJuPdGEWqeU_ihlEIrZCFEgC3CT8KmA_cZVcg&oe=634FF9AE";
  try {
    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Số điện thoại này đã được đăng ký" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      password: hashedPassword,
      username,
      phoneNumber,
      avatarURL,
    });

    const token = jwt.sign(
      { phoneNumber: user.phoneNumber, id: user._id },
      "test",
      {
        expiresIn: "5h",
      }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports.verifyOTP = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({ phoneNumber });

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Số điện thoại chưa được đăng ký" });
    }

    const isCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isCorrect) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      { phoneNumber: existingUser.phoneNumber, id: existingUser._id },
      "test",
      { expiresIn: "5h" }
    );

    res.status(200).json({ user: existingUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};
