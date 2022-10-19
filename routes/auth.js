
const { signin,signup,verifyOTP } = require('../controllers/authController.js');

const router = require("express").Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post("/verify", verifyOTP);

module.exports = router;  