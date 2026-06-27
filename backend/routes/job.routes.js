const express = require("express");
const { 
  createJob, 
  getAllJobs, 
  getJobById, 
  updateJob, 
  deleteJob, 
  getRecruiterJobs 
} = require("../controllers/job.controller");
const { getRecommendations } = require("../controllers/recommendation.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllJobs);

// Protected routes (MUST come before /:id to avoid route conflicts)
router.use(authenticate);

router.get("/recruiter/my-jobs", authorize("recruiter", "admin"), getRecruiterJobs);
router.get("/recommendations/matches", authorize("candidate", "admin"), getRecommendations);
router.post("/", authorize("recruiter", "admin"), createJob);
router.put("/:id", authorize("recruiter", "admin"), updateJob);
router.delete("/:id", authorize("recruiter", "admin"), deleteJob);

// /:id MUST be LAST — it's a catch-all wildcard
router.get("/:id", getJobById);

module.exports = router;
