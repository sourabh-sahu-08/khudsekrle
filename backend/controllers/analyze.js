const Groq = require("groq-sdk");
const Analysis = require("../models/Analysis");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const buildAnalysisPrompt = ({ code, language }) => `
Analyze the following ${language} code.

Return a single valid JSON object only.

{
  "findings": "Bulleted technical findings.",
  "explanation": "Short explanation of the main problems and the recommended fix strategy.",
  "correctedCode": "A corrected production-ready version of the code.",
  "expectedOutput": "The likely output or behavior of the corrected code.",
  "optimizedCode": "A more efficient implementation when one is appropriate.",
  "timeComplexity": "Big-O notation with one sentence of reasoning.",
  "spaceComplexity": "Big-O notation with one sentence of reasoning.",
  "confidenceScore": "A percentage string such as 92%.",
  "securityAudit": "Security observations with a concise score or summary.",
  "bestPractices": "Three to five practical best-practice recommendations."
}

Focus on:
1. Correctness, edge cases, and likely bugs.
2. Security risks relevant to the code.
3. Performance bottlenecks and maintainability.
4. Clear, implementation-ready recommendations.

Source code:
\`\`\`${language}
${code}
\`\`\`
`;

exports.analyzeCode = async (req, res, next) => {
  try {
    const code = req.body.code?.trim();
    const language = req.body.language?.trim();

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "Please provide code and a language.",
      });
    }

    if (code.length > 15000) {
      return res.status(400).json({
        success: false,
        message: "Code is too long for deep analysis. Please keep snippets under 15k characters.",
      });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a senior software engineer and security reviewer. Respond with strict JSON only.",
        },
        {
          role: "user",
          content: buildAnalysisPrompt({ code, language }),
        },
      ],
      response_format: { type: "json_object" },
    });

    const rawContent = response.choices?.[0]?.message?.content;

    if (!rawContent) {
      return res.status(502).json({
        success: false,
        message: "The analysis provider returned an empty response.",
      });
    }

    let analysisData;

    try {
      analysisData = JSON.parse(rawContent);
    } catch (parseError) {
      return res.status(502).json({
        success: false,
        message: "The analysis provider returned an invalid response format.",
      });
    }

    const analysis = await Analysis.create({
      userId: req.user.id,
      originalCode: code,
      language,
      ...analysisData,
    });

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (err) {
    next(err);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const history = await Analysis.find({ userId: req.user.id }).sort("-createdAt");
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (err) {
    next(err);
  }
};

exports.getAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: "Analysis not found." });
    }

    if (analysis.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this analysis.",
      });
    }

    res.status(200).json({ success: true, data: analysis });
  } catch (err) {
    next(err);
  }
};

exports.deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: "Analysis not found." });
    }

    if (analysis.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this analysis.",
      });
    }

    await analysis.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const totalAnalyses = await Analysis.countDocuments({ userId: req.user.id });
    const corrections = await Analysis.countDocuments({
      userId: req.user.id,
      correctedCode: { $nin: [null, ""] },
    });
    const optimizations = await Analysis.countDocuments({
      userId: req.user.id,
      optimizedCode: { $nin: [null, ""] },
    });

    res.status(200).json({
      success: true,
      data: {
        totalAnalyses,
        corrections,
        optimizations,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: "Analysis not found." });
    }

    if (analysis.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to chat about this analysis.",
      });
    }

    const prompt = `
Context:
- Language: ${analysis.language}
- Original code:
${analysis.originalCode}

- Previous findings:
${analysis.findings}

User question:
${message}

Respond clearly, concisely, and technically.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a senior software engineer helping a developer understand an analysis result.",
        },
        { role: "user", content: prompt },
      ],
    });

    const aiResponse = response.choices[0].message.content;

    analysis.chatHistory.push({ role: "user", content: message });
    analysis.chatHistory.push({ role: "ai", content: aiResponse });
    await analysis.save();

    res.status(200).json({
      success: true,
      data: aiResponse,
    });
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: "Analysis not found." });
    }

    const comment = {
      user: req.user.id,
      userName: req.user.name || "User",
      text,
      createdAt: new Date(),
    };

    analysis.comments.push(comment);
    await analysis.save();

    res.status(200).json({
      success: true,
      data: analysis.comments,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: "Analysis not found." });
    }

    const comment = analysis.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found." });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this comment.",
      });
    }

    comment.deleteOne();
    await analysis.save();

    res.status(200).json({
      success: true,
      data: analysis.comments,
    });
  } catch (err) {
    next(err);
  }
};

exports.editComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: "Analysis not found." });
    }

    const comment = analysis.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found." });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to edit this comment.",
      });
    }

    comment.text = text;
    await analysis.save();

    res.status(200).json({
      success: true,
      data: analysis.comments,
    });
  } catch (err) {
    next(err);
  }
};

exports.togglePublic = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: "Analysis not found." });
    }

    if (analysis.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized." });
    }

    analysis.isPublic = !analysis.isPublic;
    await analysis.save();

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPublicAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis || !analysis.isPublic) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found or not public.",
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (err) {
    next(err);
  }
};
