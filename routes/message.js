
const { getAllMessage,addMessage,uploadFile ,deleteMessage} = require('../controllers/messageController');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const upload = multer();
const router = require("express").Router();

router.post('/sendMessage',auth, addMessage);
router.post('/getAllMessage',auth, getAllMessage);
router.post('/uploadFile',upload.single('media'),auth, uploadFile);
router.post('/deleteMessage',auth,deleteMessage)
module.exports = router; 