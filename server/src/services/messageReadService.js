const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const markConversationAsRead = async (conversationId, userId) => {
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
    throw createError(
      "You are not a participant in this conversation",
      403
    );
  }

  const result = await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      readBy: { $ne: userId }
    },
    {
      $addToSet: { readBy: userId }
    }
  );

  return {
    markedAsRead: result.modifiedCount
  };
};

module.exports = {
  markConversationAsRead
};