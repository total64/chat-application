
const {
  sendMessage,
  getConversationMessages
} = require("../services/messageService");

const createMessage = async (req, res, next) => {
  try {
    const message = await sendMessage({
      ...req.body,
      senderId: req.user.id
    });

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    next(error);
  }
};

const listMessages = async (req, res, next) => {
  try {
    const messages = await getConversationMessages({
      conversationId: req.params.conversationId,
      userId: req.user.id,
      page: req.query.page,
      limit: req.query.limit
    });

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  listMessages
};
