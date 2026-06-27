const mongoose = require('mongoose');
const Job = require('./models/Job.model');
const User = require('./models/User.model');
const Company = require('./models/Company.model');
require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to seed data...");

    // 1. Find or create recruiter
    let recruiter = await User.findOne({ role: 'recruiter' });
    if (!recruiter) {
      recruiter = await User.create({
        name: "Seed Recruiter",
        email: "recruiter@example.com",
        password: "password123",
        role: "recruiter"
      });
      console.log("Created seed recruiter");
    }

    // 2. Find or create company
    let company = await Company.findOne();
    if (!company) {
      company = await Company.create({
        name: "HireHub Innovations",
        description: "A fast-growing recruitment platform",
        location: "Remote",
        website: "https://hirehub.com"
      });
      console.log("Created seed company");
    }

    const demoJobs = [
      {
        title: "Senior React Developer",
        description: "We are looking for an expert in React.js with 3+ years of experience in building high-performance web applications. Must know Redux and Tailwind.",
        companyId: company._id,
        location: "Remote",
        salary: "$120,000",
        type: "Full-time",
        skills: ["react", "javascript", "tailwind", "redux"],
        postedBy: recruiter._id
      },
      {
        title: "Node.js Backend Specialist",
        description: "Expert Node.js developer needed to architect scalable APIs and microservices. Must have deep knowledge of MongoDB and smart search integrations.",
        companyId: company._id,
        location: "Hybrid",
        salary: "$130,000",
        type: "Contract",
        skills: ["nodejs", "express", "mongodb", "cloud"],
        postedBy: recruiter._id
      },
      {
        title: "Frontend UI/UX Engineer",
        description: "Focus on building beautiful dashboard interfaces using Framer Motion and modern CSS. Strong eye for design is a must.",
        companyId: company._id,
        location: "San Francisco",
        salary: "$140,000",
        type: "Full-time",
        skills: ["react", "framer-motion", "css", "figma"],
        postedBy: recruiter._id
      }
    ];

    await Job.insertMany(demoJobs);
    console.log("Successfully seeded 3 demo jobs with company and recruiter references!");
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();
