const express = require("express");
const {
  createDirectConversation
} = require("../controllers/conversationController");

const router = express.Router();

router.post("/direct", createDirectConversation);

module.exports = router;