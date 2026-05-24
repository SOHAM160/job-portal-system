const express = require("express");
const { 
  createJob, 
  getAllJobs, 
  getJobById, 
  updateJob, 
  deleteJob, 
  getRecruiterJobs 
} = require("../controllers/job.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Protected routes
router.use(authenticate);

router.get("/recruiter/my-jobs", authorize("recruiter", "admin"), getRecruiterJobs);
router.post("/", authorize("recruiter", "admin"), createJob);
router.put("/:id", authorize("recruiter", "admin"), updateJob);
router.delete("/:id", authorize("recruiter", "admin"), deleteJob);

module.exports = router;
