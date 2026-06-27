const express = require("express");
const { getRecruiterStats, getCandidateStats } = require("../controllers/stats.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get("/recruiter", authorize("recruiter", "admin"), getRecruiterStats);
router.get("/candidate", authorize("candidate", "admin"), getCandidateStats);

module.exports = router;
