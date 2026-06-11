const express = require("express");
const { getConversations, getMessages, sendMessage } = require("../controllers/chat.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get("/conversations", getConversations);
router.get("/messages/:conversationId", getMessages);
router.post("/send", sendMessage);

module.exports = router;
