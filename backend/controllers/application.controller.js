const Application = require("../models/Application.model");
const Job = require("../models/Job.model");

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
exports.applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      candidate: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: "You have already applied for this job" });
    }

    const application = await Application.create({
      job: req.params.jobId,
      candidate: req.user._id,
      resume: req.body.resume,
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate applications
// @route   GET /api/applications/my-applications
// @access  Private (Candidate)
exports.getCandidateApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({
        path: "job",
        select: "title company location salary type",
      })
      .sort("-createdAt");

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application for a job (Recruiter view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
exports.getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to view these applications" });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("candidate", "name email profilePicture")
      .sort("-createdAt");

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Recruiter/Admin)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    let application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Check ownership of the job associated with application
    if (application.job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update status" });
    }

    application.status = req.body.status;
    await application.save();

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};
