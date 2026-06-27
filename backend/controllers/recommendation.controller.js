const Job = require("../models/Job.model");
const User = require("../models/User.model");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// @desc    Get smart job recommendations for a candidate
// @route   GET /api/jobs/recommendations/matches
// @access  Private (Candidate)
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 1. Fetch available jobs
    const jobs = await Job.find().populate("companyId", "name logo").limit(20);
    console.log(`🔍 Smart Recommender: Found ${jobs.length} jobs. User skills: [${(user.skills || []).join(", ")}], Bio: "${user.bio || "none"}"`);

    if (!jobs.length) {
      return res.json({ success: true, recommendations: [] });
    }

    // 2. Build Candidate Profile Summary
    const candidateProfile = {
      skills: user.skills || [],
      bio: user.bio || "No bio provided"
    };

    // 3. Prepare Prompt — force strict index bounds
    const jobList = jobs.map((j, i) => 
      `[${i}] "${j.title}" | Skills: ${j.skills.join(", ")} | ${j.description.substring(0, 100)}`
    ).join("\n");

    const prompt = `You are a job matching assistant. Match this candidate to the best jobs.

CANDIDATE:
- Skills: ${candidateProfile.skills.join(", ") || "general"}
- Bio: ${candidateProfile.bio}

JOBS (index 0 to ${jobs.length - 1}):
${jobList}

Return a JSON object with a "matches" array. Each match has: jobIndex (integer 0-${jobs.length - 1}), matchPercentage (0-100), explanation (1-2 sentences).
Pick the top ${Math.min(5, jobs.length)} most relevant jobs. Example:
{"matches": [{"jobIndex": 0, "matchPercentage": 85, "explanation": "Strong React skills match."}]}`;

    // 4. Get Result
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const aiResultRaw = completion.choices[0].message.content;
    console.log("🤖 MATCH ENGINE RAW:", aiResultRaw.substring(0, 300));
    
    const aiResult = JSON.parse(aiResultRaw);
    
    // Extract array from any shape: { matches: [...] }, { recommendations: [...] }, or [...]
    let rankingArray = [];
    if (Array.isArray(aiResult)) {
      rankingArray = aiResult;
    } else if (Array.isArray(aiResult.matches)) {
      rankingArray = aiResult.matches;
    } else if (Array.isArray(aiResult.recommendations)) {
      rankingArray = aiResult.recommendations;
    } else {
      // Try to find any array in the response
      const firstArray = Object.values(aiResult).find(v => Array.isArray(v));
      if (firstArray) rankingArray = firstArray;
    }

    console.log(`📊 Match engine returned ${rankingArray.length} matches`);

    // 5. Map back to real Job objects (with bounds checking)
    const recommendations = rankingArray
      .filter(item => {
        const idx = item.jobIndex;
        return typeof idx === "number" && idx >= 0 && idx < jobs.length;
      })
      .map(item => {
        const job = jobs[item.jobIndex];
        return {
          _id: job._id,
          title: job.title,
          description: job.description,
          location: job.location,
          salary: job.salary,
          type: job.type,
          skills: job.skills || [],
          companyId: job.companyId,
          createdAt: job.createdAt,
          matchPercentage: item.matchPercentage || 50,
          explanation: item.explanation || "This job matches your profile."
        };
      });

    console.log(`✅ Sending ${recommendations.length} recommendations to frontend`);

    // Disable caching so the browser always gets fresh data
    res.set("Cache-Control", "no-store");
    res.json({ success: true, recommendations });

  } catch (error) {
    console.error("❌ Recommendations Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate recommendations",
      error: error.message 
    });
  }
};
