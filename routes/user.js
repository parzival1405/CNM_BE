const {
  getAllFriends,
  getUserByPhonenumber,
  requestAddFriend,
  updateProfile,
  acceptFriend,
  deniedFriend,
  deleteFriend
} = require("../controllers/userController");
const { auth } = require("../middleware/auth");
const router = require("express").Router();

router.post("/getAllFriends", auth, getAllFriends);
router.post("/getUserByPhonenumber", getUserByPhonenumber);
router.post("/requestAddFriend", auth, requestAddFriend);
router.post("/updateProfile", auth, updateProfile);
router.post("/acceptFriend", auth, acceptFriend);
router.post("/deniedFriend", auth, deniedFriend);
router.post("/deleteFriend", auth, deleteFriend);

module.exports = router;
