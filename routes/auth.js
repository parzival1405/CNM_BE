
const { signin,signup,checkOTP,updatePassword,updatePhonenumber,checkPhonenumber } = require('../controllers/authController.js');

const router = require("express").Router();
const { auth } = require("../middleware/auth");
router.post('/signin', signin);
router.post('/signup', signup);
router.post("/checkOTP", checkOTP);
router.post('/updatePassword',auth, updatePassword);
router.post('/updatePhonenumber',auth, updatePhonenumber);
router.post('/checkPhonenumber', checkPhonenumber);

module.exports = router;  