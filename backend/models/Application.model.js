const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    resume: {
      type: String, // Cloudinary URL
    },
    resumePublicId: {
      type: String, // Cloudinary public_id for cleanup
    },
    atsScore: {
      type: Number, // 0-100
      default: null,
    },
    interview: {
      date: { type: Date },
      meetingLink: { type: String },
      status: {
        type: String,
        enum: ["Scheduled", "Completed", "Cancelled"],
        default: "Scheduled",
      },
    },
  },
  { timestamps: true }
);

// Ensure a candidate can only apply to a job once
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
