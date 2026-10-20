const {
  getMyConversations
} = require("../services/conversationListService");

const listMyConversations = async (req, res, next) => {
  try {
    const conversations = await getMyConversations(req.user.id);

    res.json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listMyConversations
};