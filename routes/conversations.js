const {
  getAllConversation,
  createConversation,
  changeLabel,
  addMemberGroup,
  deleteGroup,
  deleteMember,
  outGroup,
  updateCreator,
} = require("../controllers/conversationController");
const { auth } = require("../middleware/auth");

const router = require("express").Router();

router.post("/getAllConversations", auth, getAllConversation);
router.post("/createConversation", auth, createConversation);
router.post("/changeLabel", auth, changeLabel);
router.post("/addMemberGroup", auth, addMemberGroup);
router.post("/deleteGroup", auth, deleteGroup);
router.post("/deleteMember", auth, deleteMember);
router.post("/outGroup", auth, outGroup);
router.post("/updateCreator", auth, updateCreator);

module.exports = router;
