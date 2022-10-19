
const { getAllMessage,addMessage,getUnseenMessage } = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

const router = require("express").Router();

router.post('/sendMessage',auth, addMessage);
router.post('/getAllMessage',auth, getAllMessage);
router.post('/unseen',auth, getUnseenMessage);
module.exports = router; 