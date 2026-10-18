const express = require("express");
const {
  createMessage,
  getMessages
} = require("../controllers/messageController");
const {
  markAsRead
} = require("../controllers/messageReadController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/", createMessage);
router.get("/:conversationId", getMessages);
router.patch("/:conversationId/read", markAsRead);

module.exports = router;