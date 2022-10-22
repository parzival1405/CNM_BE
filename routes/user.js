const { getAllFriends,getUserByPhonenumber ,requestAddFriend} = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const router = require("express").Router();

router.post('/getAllFriends',auth, getAllFriends);
router.post('/getUserByPhonenumber',auth, getUserByPhonenumber);
router.post('/requestAddFriend',auth,requestAddFriend)
module.exports = router;  