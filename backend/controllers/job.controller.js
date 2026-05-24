const Job = require("../models/Job.model");
const Application = require("../models/Application.model");

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin)
exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user._id,
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (with search and filter)
// @route   GET /api/jobs
// @access  Public
exports.getAllJobs = async (req, res, next) => {
  try {
    const { keyword, location, skills, type, salary } = req.query;
    let query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (skills) {
      const skillsArray = skills.split(",").map(skill => skill.trim());
      query.skills = { $in: skillsArray.map(s => new RegExp(s, "i")) };
    }

    if (type && type !== "All") {
      query.type = type;
    }

    if (salary) {
      // Extremely basic salary match (usually it's a range, but this is simple equality/regex)
      query.salary = { $regex: salary, $options: "i" };
    }

    const jobs = await Job.find(query)
      .populate("companyId")
      .populate("postedBy", "name email")
      .sort("-createdAt");

    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter/Admin)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this job" });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter/Admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this job" });
    }

    await job.deleteOne();

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter)
exports.getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort("-createdAt");
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};
