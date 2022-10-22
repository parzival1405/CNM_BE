
const { getAllConversation,createConversation } = require('../controllers/conversationController');
const { auth } = require('../middleware/auth');

const router = require("express").Router();

router.post('/getAllConversations',auth, getAllConversation);
router.post('/createConversation',auth, createConversation);

module.exports = router;  