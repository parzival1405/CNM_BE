const { getAllFriends,getUserByPhonenumber ,requestAddFriend,updateProfile} = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const router = require("express").Router();

router.post('/getAllFriends',auth, getAllFriends);
router.post('/getUserByPhonenumber', getUserByPhonenumber);
router.post('/requestAddFriend',auth,requestAddFriend)
router.post('/updateProfile',auth,updateProfile)


module.exports = router;  