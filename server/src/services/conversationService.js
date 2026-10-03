const Conversation = require("../models/Conversation");
const User = require("../models/User");

const findOrCreateDirectConversation = async (userId, otherUserId) => {
  if (userId === otherUserId) {
    throw new Error("Users cannot create a conversation with themselves");
  }

  const users = await User.find({
    _id: { $in: [userId, otherUserId] }
  });

  if (users.length !== 2) {
    throw new Error("One or both users do not exist");
  }

  let conversation = await Conversation.findOne({
    type: "direct",
    participants: {
      $all: [userId, otherUserId]
    }
  });

  if (!conversation) {
    conversation = await Conversation.create({
      type: "direct",
      participants: [userId, otherUserId]
    });
  }

  return conversation;
};

module.exports = {
  findOrCreateDirectConversation
};