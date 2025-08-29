const router = require("express").Router();
const auth = require("../middleware/auth");
const delay = require("../middleware/delay")(200); // optional
const user = require("../controllers/userController");

router.post("/register", delay, user.register);
router.post("/login", delay, user.login);
router.get("/homepage", auth, delay, user.homepage);

router.post("/forgot-password", delay, user.forgotPassword);
router.post("/reset-password", delay, user.resetPassword);

module.exports = router;
