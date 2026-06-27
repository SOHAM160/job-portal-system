const Job = require("../models/Job.model");
const Application = require("../models/Application.model");
const mongoose = require("mongoose");

// @desc    Get stats for recruiter dashboard
// @route   GET /api/stats/recruiter
// @access  Private (Recruiter)
exports.getRecruiterStats = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;

    // 1. Total Jobs Posted
    const totalJobs = await Job.countDocuments({ postedBy: recruiterId });

    // Find all job IDs posted by this recruiter
    const myJobs = await Job.find({ postedBy: recruiterId }).select("_id title skills");
    const myJobIds = myJobs.map(j => j._id);

    // 2. Total Applications received for these jobs
    const totalApplications = await Application.countDocuments({ job: { $in: myJobIds } });

    // 3. Application Status Breakdown (Acceptance/Rejection Rate)
    const statusBreakdown = await Application.aggregate([
      { $match: { job: { $in: myJobIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 4. Applications per Job (Top 5)
    const appsPerJob = await Application.aggregate([
      { $match: { job: { $in: myJobIds } } },
      { $group: { _id: "$job", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      { $unwind: "$jobDetails" },
      { $project: { title: "$jobDetails.title", count: 1 } }
    ]);

    // 5. Hiring Trend (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const hiringTrend = await Application.aggregate([
      { 
        $match: { 
          job: { $in: myJobIds },
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 6. Most Required Skills (based on recruiter's jobs)
    const skillsMap = {};
    myJobs.forEach(job => {
      job.skills.forEach(skill => {
        const s = skill.toLowerCase().trim();
        skillsMap[s] = (skillsMap[s] || 0) + 1;
      });
    });
    
    const topSkills = Object.entries(skillsMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        totalApplications,
        statusBreakdown,
        appsPerJob,
        hiringTrend,
        topSkills
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stats for candidate dashboard
// @route   GET /api/stats/candidate
// @access  Private (Candidate)
exports.getCandidateStats = async (req, res, next) => {
  try {
    const candidateId = req.user._id;

    // 1. Total Applications Submitted
    const totalApplications = await Application.countDocuments({ candidate: candidateId });

    // 2. Status Breakdown
    const statusBreakdown = await Application.aggregate([
      { $match: { candidate: candidateId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 3. Application Trend (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const applicationTrend = await Application.aggregate([
      { 
        $match: { 
          candidate: candidateId,
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 4. Skills most required in jobs the candidate applied to
    const applications = await Application.find({ candidate: candidateId }).populate("job", "skills");
    const skillsMap = {};
    applications.forEach(app => {
      if (app.job && app.job.skills) {
        app.job.skills.forEach(skill => {
          const s = skill.toLowerCase().trim();
          skillsMap[s] = (skillsMap[s] || 0) + 1;
        });
      }
    });

    const topAppliedSkills = Object.entries(skillsMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    res.status(200).json({
      success: true,
      stats: {
        totalApplications,
        statusBreakdown,
        applicationTrend,
        topAppliedSkills
      }
    });
  } catch (error) {
    next(error);
  }
};
