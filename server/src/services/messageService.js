
const mongoose = require("mongoose");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sendMessage = async (conversationId, senderId, text) => {
  if (!mongoose.isValidObjectId(conversationId)) {
    throw createError("Invalid conversation ID", 400);
  }

  if (!mongoose.isValidObjectId(senderId)) {
    throw createError("Invalid sender ID", 400);
  }

  if (typeof text !== "string" || !text.trim()) {
    throw createError("Message text is required", 400);
  }

  const cleanText = text.trim();

  if (cleanText.length > 5000) {
    throw createError("Message cannot exceed 5000 characters", 400);
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw createError("Conversation not found", 404);
  }

  const isParticipant = conversation.participants.some(
    (participantId) => participantId.toString() === senderId
  );

  if (!isParticipant) {
    throw createError("You are not a participant in this conversation", 403);
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    text: cleanText,
    readBy: [senderId]
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  return message;
};

const getConversationMessages = async (
  conversationId,
  userId,
  limit = 30,
  before
) => {
  if (
    !mongoose.isValidObjectId(conversationId) ||
    !mongoose.isValidObjectId(userId)
  ) {
    throw createError("Invalid conversation or user ID", 400);
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw createError("Conversation not found", 404);
  }

  const isParticipant = conversation.participants.some(
    (participantId) => participantId.toString() === userId
  );

  if (!isParticipant) {
    throw createError("You are not a participant in this conversation", 403);
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);
  const filter = { conversation: conversationId };

  if (before) {
    if (!mongoose.isValidObjectId(before)) {
      throw createError("Invalid message cursor", 400);
    }

    const cursorMessage = await Message.findOne({
      _id: before,
      conversation: conversationId
    }).select("createdAt");

    if (!cursorMessage) {
      throw createError("Message cursor not found", 404);
    }

    filter.$or = [
      { createdAt: { $lt: cursorMessage.createdAt } },
      {
        createdAt: cursorMessage.createdAt,
        _id: { $lt: cursorMessage._id }
      }
    ];
  }

  const messages = await Message.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(safeLimit)
    .populate("sender", "name avatarUrl");

  return messages.reverse();
};

module.exports = {
  sendMessage,
  getConversationMessages
};
