const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const User = require("../models/User.model");
const Job = require("../models/Job.model");
const Application = require("../models/Application.model");

// Initialize AI clients
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

/**
 * Unified AI Helper: Tries Groq first (preferred for speed/limits), then falls back to Gemini
 */
async function getAssistantResponse(prompt) {
  // 1. Try Groq (Llama 3 70B - High Performance)
  if (groq) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
      });
      console.log("✅ Assistant response generated using Groq (Llama 3.3)");
      return completion.choices[0].message.content;
    } catch (err) {
      console.log(`⚠️ Groq failed: ${err.message}. Falling back to Gemini...`);
    }
  }

  // 2. Fallback to Gemini
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      console.log("✅ Assistant response generated using Gemini");
      return result.response.text();
    } catch (err) {
      console.log(`❌ Gemini also failed: ${err.message}`);
      throw new Error("All service providers exhausted. Please check API keys or quotas.");
    }
  }

  throw new Error("No API keys configured in .env");
}

// @desc    Handle Assistant queries for recruiters
// @route   POST /api/assistant/query
// @access  Private (Recruiter)
exports.handleAssistantQuery = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Missing prompt" });

    // Pre-fetch relevant context
    const myJobs = await Job.find({ postedBy: req.user._id }).select("title skills location type salary");
    const jobIds = myJobs.map(j => j._id);
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("candidate", "name email")
      .populate("job", "title skills")
      .limit(20);
    const candidates = await User.find({ role: "candidate" }).limit(15).select("name email");

    const contextSummary = {
      recruiterName: req.user.name,
      jobs: myJobs.map(j => ({ title: j.title, skills: j.skills, location: j.location })),
      recentApplications: applications.map(a => ({
        candidate: a.candidate?.name,
        email: a.candidate?.email,
        job: a.job?.title,
        status: a.status,
        appliedOn: a.createdAt
      })),
      allCandidates: candidates.map(c => ({ name: c.name, email: c.email }))
    };

    const finalPrompt = `
You are a Hiring Assistant for 'HireHub' Job Portal. Use the following real-time data from the recruiter's database to answer accurately.

RECRUITER: ${contextSummary.recruiterName}

ACTIVE JOB POSTINGS:
${JSON.stringify(contextSummary.jobs, null, 1)}

RECENT APPLICATIONS:
${JSON.stringify(contextSummary.recentApplications, null, 1)}

USER DATABASE (CANDIDATES):
${JSON.stringify(contextSummary.allCandidates, null, 1)}

RECRUITER'S QUERY: "${prompt}"

INSTRUCTIONS:
1. Be professional, direct, and concise.
2. If searching for candidates, prioritize those found in the data.
3. If drafting emails, use [Candidate Name] placeholders.
4. If the data provided is insufficient to answer perfectly, answer based on common hiring practices while mentioning data limits.
5. Format your response with clear bullet points where appropriate.
    `;

    const responseText = await getAssistantResponse(finalPrompt);

    res.status(200).json({
      success: true,
      answer: responseText,
      intent: "GENERAL"
    });

  } catch (error) {
    console.error("Assistant Global Error:", error.message);
    res.status(500).json({
      success: false,
      message: "The Assistant is temporarily unavailable. This usually happens when API quotas are exceeded.",
      error: error.message
    });
  }
};
