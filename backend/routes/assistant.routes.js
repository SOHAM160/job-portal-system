const express = require("express");
const { handleAssistantQuery } = require("../controllers/assistant.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.post("/query", authorize("recruiter", "admin"), handleAssistantQuery);

module.exports = router;
