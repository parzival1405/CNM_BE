
const { getAllConversation } = require('../controllers/conversationController');
const { auth } = require('../middleware/auth');

const router = require("express").Router();

router.post('/getAllConversations',auth, getAllConversation);

module.exports = router;  