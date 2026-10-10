
const mongoose = require("mongoose");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const sendMessage = async ({
  conversationId,
  senderId,
  content,
  type = "text",
  attachmentUrl = "",
  attachmentName = ""
}) => {
  if (!mongoose.isValidObjectId(conversationId)) {
    throw new Error("Invalid conversation ID");
  }

  if (!mongoose.isValidObjectId(senderId)) {
    throw new Error("Invalid sender ID");
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (participantId) => participantId.toString() === senderId
  );

  if (!isParticipant) {
    throw new Error("You are not a participant in this conversation");
  }

  if (!["text", "image", "file"].includes(type)) {
    throw new Error("Invalid message type");
  }

  const trimmedContent = typeof content === "string" ? content.trim() : "";

  if (type === "text" && !trimmedContent) {
    throw new Error("Text messages cannot be empty");
  }

  if (type !== "text" && !attachmentUrl) {
    throw new Error("Attachment URL is required");
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    content: trimmedContent,
    type,
    attachmentUrl,
    attachmentName
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  return message;
};

const getConversationMessages = async ({
  conversationId,
  userId,
  page = 1,
  limit = 30
}) => {
  if (!mongoose.isValidObjectId(conversationId)) {
    throw new Error("Invalid conversation ID");
  }

  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (participantId) => participantId.toString() === userId
  );

  if (!isParticipant) {
    throw new Error("You are not a participant in this conversation");
  }

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 30));

  return Message.find({ conversation: conversationId })
    .populate("sender", "name avatarUrl")
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * safeLimit)
    .limit(safeLimit);
};

module.exports = {
  sendMessage,
  getConversationMessages
};
