const Message = require("../models/Message.model");
const Conversation = require("../models/Conversation.model");
const User = require("../models/User.model");

// @desc    Fetch all conversations for a user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] },
    })
      .populate("participants", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch messages for a specific conversation
// @route   GET /api/chat/messages/:conversationId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate("sender", "name email profilePhoto role")
      .populate("receiver", "name email profilePhoto role")
      .sort({ createdAt: 1 });
      
    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message (and create conversation if it doesn't exist)
// @route   POST /api/chat/send
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ success: false, message: "Missing receiver or text" });
    }

    // Find conversation or create one
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, receiverId],
      });
    }

    // Create the message
    let newMessage = await Message.create({
      conversationId: conversation._id,
      sender: req.user._id,
      receiver: receiverId,
      text,
    });
    console.log("SENDING MESSAGE - sender:", req.user._id, "receiver:", receiverId);

    // Populate sender and receiver for the real-time emit later
    newMessage = await newMessage.populate("sender", "name profilePhoto");
    newMessage = await newMessage.populate("receiver", "name profilePhoto");

    // Update conversation last message
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    res.status(200).json({ success: true, message: newMessage });
  } catch (error) {
    next(error);
  }
};
