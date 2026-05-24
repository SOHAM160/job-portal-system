const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Freelance", "Remote"],
      default: "Full-time",
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    salary: {
      type: String,
      required: [true, "Salary information is required"],
    },
    requirements: [
      {
        type: String,
      },
    ],
    skills: [
      {
        type: String,
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
