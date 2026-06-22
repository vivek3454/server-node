const express = require("express");

const router = express.Router();


const {
  getMessages,
} = require("../controllers/messageController");
const { isAuthenticated } = require("../utils/sendToken");

router.use(isAuthenticated);

router.get("/:receiverId", getMessages);

module.exports = router;
