const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getMyConversations = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw createError("Invalid user ID", 400);
  }

  const conversations = await Conversation.find({
    participants: userId
  })
    .sort({ updatedAt: -1 })
    .populate("participants", "name avatarUrl status lastSeen")
    .populate({
      path: "lastMessage",
      select: "sender text createdAt readBy"
    });

  return conversations;
};

module.exports = {
  getMyConversations
};