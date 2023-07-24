var express = require("express");
var router = express.Router();

const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/* GET home page. */
router.get("/", message_controller.index);

router.get("/sign-up", user_controller.user_create_get);

router.post("/sign-up", user_controller.user_create_post);

router.get("/log-in", user_controller.user_login_get);

router.post("/log-in", user_controller.user_login_post);

module.exports = router;
