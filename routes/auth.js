
const { signin,signup,checkOTP } = require('../controllers/authController.js');

const router = require("express").Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post("/checkOTP", checkOTP);

module.exports = router;  