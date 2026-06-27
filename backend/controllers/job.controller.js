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
    const { keyword, q, location, skills, type, salary } = req.query;
    let query = {};

    const searchVal = q || keyword;
    if (searchVal) {
      query.$or = [
        { title: { $regex: searchVal, $options: "i" } },
        { description: { $regex: searchVal, $options: "i" } },
        { skills: { $regex: searchVal, $options: "i" } },
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

    let jobs = await Job.find(query)
      .populate("companyId")
      .populate("postedBy", "name email")
      .sort("-createdAt");

    if (salary) {
      const querySalaryVal = parseFloat(salary.replace(/[$,\s]/g, "").toLowerCase().replace("k", "000"));
      
      if (!isNaN(querySalaryVal)) {
        jobs = jobs.filter(job => {
          if (!job.salary) return true;
          
          const jobSalaryStr = String(job.salary).replace(/[$,\s]/g, "").toLowerCase();
          const parts = jobSalaryStr.split(/-|to/);
          
          const parseVal = (str) => {
            let multiplier = 1;
            if (str.includes("k")) {
              multiplier = 1000;
              str = str.replace("k", "");
            }
            const val = parseFloat(str);
            return isNaN(val) ? 0 : val * multiplier;
          };

          let min = 0;
          let max = Infinity;

          if (parts.length === 2) {
            min = parseVal(parts[0]);
            max = parseVal(parts[1]);
          } else {
            min = parseVal(jobSalaryStr);
            max = min || Infinity;
          }

          return max >= querySalaryVal;
        });
      } else {
        const regex = new RegExp(salary, "i");
        jobs = jobs.filter(job => regex.test(String(job.salary)));
      }
    }

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
