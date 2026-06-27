const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const Application = require("../models/Application.model");
const Job = require("../models/Job.model");
const sendEmail = require("../utils/email");
const pdfParse = require("pdf-parse");
const https = require("https");
const http = require("http");

// ── Helper: extract Cloudinary publicId from URL ──────────
// ── Helper: download PDF from any plain URL ───────────────
const downloadPDF = (urlStr) =>
  new Promise((resolve, reject) => {
    try {
      const url = new URL(urlStr);
      const client = url.protocol === "https:" ? https : http;
      
      const options = {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept": "application/pdf,*/*"
        }
      };

      client.get(url, options, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download PDF: Status ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      }).on("error", reject);
    } catch (err) {
      reject(new Error(`Invalid URL: ${err.message}`));
    }
  });

// ── Helper: ATS keyword scoring ───────────────────────────
const ATS_KEYWORDS = [
  // Technical
  "javascript", "python", "java", "react", "node", "angular", "vue", "typescript",
  "sql", "mongodb", "aws", "docker", "kubernetes", "git", "html", "css",
  "machine learning", "data analysis", "api", "rest", "graphql", "ci/cd",
  // Soft skills
  "leadership", "teamwork", "communication", "problem solving", "analytical",
  "project management", "agile", "scrum", "collaboration", "mentoring",
  // Professional
  "experience", "education", "bachelor", "master", "certification", "internship",
  "achievement", "published", "award", "volunteer", "portfolio", "github", "linkedin",
  // Formatting cues (good resume practices)
  "objective", "summary", "skills", "projects", "references",
];

function computeATSScore(text) {
  const lower = text.toLowerCase();
  let matched = 0;
  const matchedKeywords = [];

  for (const kw of ATS_KEYWORDS) {
    if (lower.includes(kw)) {
      matched++;
      matchedKeywords.push(kw);
    }
  }

  // Base score from keyword density (max 60 points)
  const keywordScore = Math.min(60, Math.round((matched / ATS_KEYWORDS.length) * 100));

  // Length bonus (max 15 points) — good resumes are 300-1200 words
  const wordCount = text.split(/\s+/).length;
  let lengthScore = 0;
  if (wordCount >= 200 && wordCount <= 1500) lengthScore = 15;
  else if (wordCount > 100) lengthScore = 8;
  else lengthScore = 3;

  // Section bonus (max 15 points) — checking common sections
  const sections = ["experience", "education", "skills", "projects", "summary"];
  const foundSections = sections.filter(s => lower.includes(s));
  const sectionScore = Math.round((foundSections.length / sections.length) * 15);

  // Contact info bonus (max 10 points) — email, phone, linkedin
  let contactScore = 0;
  if (lower.match(/[\w.-]+@[\w.-]+\.\w+/)) contactScore += 4;
  if (lower.match(/\+?\d[\d\s-]{8,}/)) contactScore += 3;
  if (lower.includes("linkedin") || lower.includes("github")) contactScore += 3;

  const total = Math.min(100, keywordScore + lengthScore + sectionScore + contactScore);

  return { score: total, matchedKeywords, wordCount, sectionsFound: foundSections };
}

// ──────────────────────────────────────────────────────────
// @desc    Apply for a job (with Cloudinary resume upload)
// @route   POST /api/applications/apply/:jobId
// @access  Private (Candidate)
// ──────────────────────────────────────────────────────────
exports.applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      candidate: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: "You have already applied for this job" });
    }

    let resumeUrl = null;

    if (req.file) {
      if (process.env.NODE_ENV === "production") {
        // In production, multer-storage-cloudinary sets path to the Cloudinary secure URL
        resumeUrl = req.file.path;
      } else {
        // In development, local disk storage stores the filename
        resumeUrl = `/uploads/resumes/${req.file.filename}`;
      }
    }
    // Fallback: resume sent as a URL link or base64 string in the request body
    else if (req.body.resume) {
      resumeUrl = req.body.resume;
    }

    const application = await Application.create({
      job: req.params.jobId,
      candidate: req.user._id,
      resume: resumeUrl,
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────
// @desc    Get candidate applications
// @route   GET /api/applications/my-applications
// @access  Private (Candidate)
// ──────────────────────────────────────────────────────────
exports.getCandidateApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({
        path: "job",
        populate: { path: "companyId", select: "name" },
      })
      .sort("-createdAt");

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────
// @desc    Get applications for a job (Recruiter view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
// ──────────────────────────────────────────────────────────
exports.getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

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

// ──────────────────────────────────────────────────────────
// @desc    Update application status (Accept/Reject)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter/Admin)
// ──────────────────────────────────────────────────────────
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    let application = await Application.findById(req.params.id)
      .populate("job")
      .populate("candidate", "name email");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const jobPostedBy = application.job.postedBy._id ? application.job.postedBy._id.toString() : application.job.postedBy.toString();
    if (jobPostedBy !== req.user._id.toString() && req.user.role !== "admin") {
      console.log("AUTH FAIL: Job posted by", jobPostedBy, "but user is", req.user._id);
      return res.status(403).json({ success: false, message: "Not authorized to update status" });
    }

    application.status = req.body.status;
    await application.save();

    // ── Send email notification if shortlisted / accepted ──
    if (req.body.status === "Accepted" && application.candidate?.email) {
      try {
        await sendEmail({
          email: application.candidate.email,
          subject: `🎉 Congratulations! You've been shortlisted for ${application.job.title}`,
          html: `
            <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">
              <div style="text-align:center;margin-bottom:24px;">
                <h1 style="color:#1e293b;font-size:28px;margin:0;">Hire <span style="color:#2563eb;">&</span> Fly</h1>
                <p style="color:#64748b;font-size:13px;margin-top:4px;">Your Career Launchpad</p>
              </div>
              <div style="background:white;padding:32px;border-radius:12px;border:1px solid #e2e8f0;">
                <h2 style="color:#059669;margin-top:0;">🎉 You've been shortlisted!</h2>
                <p style="color:#334155;font-size:15px;line-height:1.7;">
                  Hi <strong>${application.candidate.name}</strong>,
                </p>
                <p style="color:#334155;font-size:15px;line-height:1.7;">
                  Great news! The recruiter has reviewed your application for <strong>${application.job.title}</strong> and has decided to move forward with your candidacy.
                </p>
                <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;border-radius:8px;margin:20px 0;">
                  <p style="margin:0;color:#166534;font-weight:600;">What's next?</p>
                  <p style="margin:8px 0 0;color:#15803d;font-size:14px;">The recruiter will soon schedule an interview with you. Keep an eye on your dashboard and email for the meeting link and date.</p>
                </div>
                <p style="color:#64748b;font-size:13px;margin-top:24px;">Best of luck!<br/>— The HireHub Team</p>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr.message);
        // Don't fail the whole request if email fails
      }
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────
// @desc    Schedule interview for an application
// @route   PUT /api/applications/:id/interview
// @access  Private (Recruiter)
// ──────────────────────────────────────────────────────────
exports.scheduleInterview = async (req, res, next) => {
  try {
    const { date, meetingLink } = req.body;

    if (!date || !meetingLink) {
      return res.status(400).json({ success: false, message: "Date and meeting link are required" });
    }

    let application = await Application.findById(req.params.id)
      .populate("job")
      .populate("candidate", "name email");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const jobPostedBy = application.job.postedBy._id ? application.job.postedBy._id.toString() : application.job.postedBy.toString();
    if (jobPostedBy !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    application.interview = {
      date: new Date(date),
      meetingLink,
      status: "Scheduled",
    };

    // Auto-accept if still pending
    if (application.status === "Pending") {
      application.status = "Accepted";
    }

    await application.save();

    // ── Send interview email to candidate ──
    if (application.candidate?.email) {
      try {
        const interviewDate = new Date(date);
        const formattedDate = interviewDate.toLocaleDateString("en-US", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        });
        const formattedTime = interviewDate.toLocaleTimeString("en-US", {
          hour: "2-digit", minute: "2-digit",
        });

        await sendEmail({
          email: application.candidate.email,
          subject: `📅 Interview Scheduled — ${application.job.title}`,
          html: `
            <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">
              <div style="text-align:center;margin-bottom:24px;">
                <h1 style="color:#1e293b;font-size:28px;margin:0;">Hire <span style="color:#2563eb;">&</span> Fly</h1>
                <p style="color:#64748b;font-size:13px;margin-top:4px;">Your Career Launchpad</p>
              </div>
              <div style="background:white;padding:32px;border-radius:12px;border:1px solid #e2e8f0;">
                <h2 style="color:#2563eb;margin-top:0;">📅 Interview Scheduled!</h2>
                <p style="color:#334155;font-size:15px;line-height:1.7;">
                  Hi <strong>${application.candidate.name}</strong>,
                </p>
                <p style="color:#334155;font-size:15px;line-height:1.7;">
                  Your interview for <strong>${application.job.title}</strong> has been scheduled. Here are the details:
                </p>
                <div style="background:#eff6ff;padding:20px;border-radius:12px;margin:20px 0;border:1px solid #bfdbfe;">
                  <table style="width:100%;border-collapse:collapse;">
                    <tr>
                      <td style="padding:8px 0;color:#64748b;font-size:13px;font-weight:600;">📆 Date</td>
                      <td style="padding:8px 0;color:#1e293b;font-size:15px;font-weight:700;">${formattedDate}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#64748b;font-size:13px;font-weight:600;">🕐 Time</td>
                      <td style="padding:8px 0;color:#1e293b;font-size:15px;font-weight:700;">${formattedTime}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#64748b;font-size:13px;font-weight:600;">🔗 Link</td>
                      <td style="padding:8px 0;"><a href="${meetingLink}" style="color:#2563eb;font-weight:600;font-size:14px;">${meetingLink}</a></td>
                    </tr>
                  </table>
                </div>
                <a href="${meetingLink}" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:15px;">Join Meeting</a>
                <p style="color:#64748b;font-size:13px;margin-top:24px;">Good luck!<br/>— The HireHub Team</p>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Interview email failed:", emailErr.message);
      }
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────
// @desc    Scan resume and get ATS score
// @route   POST /api/applications/:id/ats-scan
// @access  Private (Candidate)
// ──────────────────────────────────────────────────────────
exports.scanResume = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Only the candidate who owns this application can scan
    if (application.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (!application.resume) {
      return res.status(400).json({ success: false, message: "No resume found for this application" });
    }

    // Get the PDF buffer from local disk or Base64
    let pdfBuffer;
    if (application.resume.startsWith("data:application/pdf;base64,")) {
      const base64str = application.resume.split(",")[1];
      pdfBuffer = Buffer.from(base64str, "base64");
    } else if (application.resume.startsWith("/uploads/resumes/")) {
      const filePath = path.join(__dirname, "..", application.resume);
      try {
        pdfBuffer = await fs.readFile(filePath);
      } catch (err) {
        return res.status(404).json({ success: false, message: "Resume file not found on server. Please re-upload your resume." });
      }
    } else if (application.resume.includes("res.cloudinary.com")) {
      try {
        pdfBuffer = await downloadPDF(application.resume);
      } catch (err) {
        return res.status(400).json({ success: false, message: "Could not download resume from Cloudinary. Please re-upload." });
      }
    } else {
      pdfBuffer = await downloadPDF(application.resume);
    }
    
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text;

    const atsResult = computeATSScore(extractedText);

    // Save score to db
    application.atsScore = atsResult.score;
    await application.save();

    res.status(200).json({
      success: true,
      atsScore: atsResult.score,
      details: {
        matchedKeywords: atsResult.matchedKeywords,
        wordCount: atsResult.wordCount,
        sectionsFound: atsResult.sectionsFound,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────
// @desc    View resume (Proxy to bypass Cloudinary restrictions)
// @route   GET /api/applications/:id/resume
// @access  Private
// ──────────────────────────────────────────────────────────
exports.viewResume = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (!application.resume) {
      return res.status(400).json({ success: false, message: "No resume found" });
    }

    // Handle base64
    if (application.resume.startsWith("data:application/pdf;base64,")) {
      const base64str = application.resume.split(",")[1];
      const buffer = Buffer.from(base64str, "base64");
      res.setHeader("Content-Type", "application/pdf");
      return res.send(buffer);
    }

    // Handle local file
    if (application.resume.startsWith("/uploads/resumes/")) {
      const filePath = path.join(__dirname, "..", application.resume);
      if (!fsSync.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: "Resume file not found. Please re-upload." });
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=resume.pdf");
      return fsSync.createReadStream(filePath).pipe(res);
    }

    // Handle Cloudinary-hosted resume URLs (production uploads)
    if (application.resume.includes("res.cloudinary.com")) {
      try {
        const pdfBuffer = await downloadPDF(application.resume);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=resume.pdf");
        return res.send(pdfBuffer);
      } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to retrieve resume from Cloudinary." });
      }
    }

    try {
      // Fallback for standard http links (Google Drive, etc.)
      const pdfBuffer = await downloadPDF(application.resume);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=resume.pdf");
      res.send(pdfBuffer);
    } catch (downloadErr) {
      console.warn("Proxy download failed:", downloadErr.message);
      return res.status(500).json({ success: false, message: "Failed to download external resume." });
    }
  } catch (error) {
    console.error("View Resume Error:", error.message);
    next(error);
  }
};
