const express = require("express");
const {
  applyToJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
  scheduleInterview,
  scanResume,
  viewResume,
} = require("../controllers/application.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { upload } = require("../config/cloudinary");

const router = express.Router();

router.use(authenticate);

// ── Common routes ────────────────────────────────────────
router.get("/:id/resume", viewResume);

// ── Candidate routes ──────────────────────────────────────
router.post("/apply/:jobId", authorize("candidate"), upload.single("resumeFile"), applyToJob);
router.get("/my-applications", authorize("candidate"), getCandidateApplications);
router.post("/:id/ats-scan", authorize("candidate"), scanResume);

// ── Recruiter routes ──────────────────────────────────────
router.get("/job/:jobId", authorize("recruiter", "admin"), getJobApplications);
router.put("/:id/status", authorize("recruiter", "admin"), updateApplicationStatus);
router.put("/:id/interview", authorize("recruiter", "admin"), scheduleInterview);

module.exports = router;
