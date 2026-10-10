
const express = require("express");
const {
  createMessage,
  listMessages
} = require("../controllers/messageController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/", createMessage);
router.get("/:conversationId", listMessages);

module.exports = router;
