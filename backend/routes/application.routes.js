const express = require("express");
const { 
  applyToJob, 
  getCandidateApplications, 
  getJobApplications, 
  updateApplicationStatus 
} = require("../controllers/application.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

// Candidate routes
router.post("/apply/:jobId", authorize("candidate"), applyToJob);
router.get("/my-applications", authorize("candidate"), getCandidateApplications);

// Recruiter routes
router.get("/job/:jobId", authorize("recruiter", "admin"), getJobApplications);
router.put("/:id/status", authorize("recruiter", "admin"), updateApplicationStatus);

module.exports = router;
