const Groq = require('groq-sdk');
const Analysis = require('../models/Analysis');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// @desc    Analyze code
// @route   POST /api/analyze
// @access  Private
exports.analyzeCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Please provide code and language' });
    }

    // Security: Limit code length to prevent API abuse and cost spikes
    if (code.length > 15000) {
      return res.status(400).json({ success: false, message: 'Code is too long for deep analysis. Please provide a snippet under 15k characters.' });
    }

    console.log(`DEBUG: ANALYZE REQUEST - User ID: ${req.user.id}, Email: ${req.user.email}, Language: ${language}`);

    const prompt = `
Analyze the following code written in ${language}. 

### CORE OBJECTIVES:
1. **CRITICAL AUDIT**: Identify syntax errors, logical bugs, and edge cases.
2. **SECURITY PROTOCOL**: Evaluate against OWASP Top 10 (SQLi, XSS, CSRF, insecure dependencies, etc.).
3. **PERFORMANCE MANIFEST**: Identify bottlenecks, O(n) complexities, and memory leaks.
4. **REASONING**: Think step-by-step. Simulate execution in your neural layers before responding.

### OUTPUT SCHEMA:
You MUST respond with a SINGLE JSON object. No markdown, no conversational prose.

{
  "findings": "Strictly technical, bulleted list of issues found. Be extremely critical.",
  "explanation": "High-level architectural breakdown of the fix logic and system implications.",
  "correctedCode": "The complete, production-ready fixed version of the code.",
  "expectedOutput": "The exact stdout/return values expected from the corrected code.",
  "optimizedCode": "A performance-optimized pattern (e.g., using Map instead of Array for O(1) lookups).",
  "timeComplexity": "Big-O notation with 1-sentence justification.",
  "spaceComplexity": "Big-O notation with 1-sentence justification.",
  "confidenceScore": "A percentage (e.g., 99%) reflecting audit certainty.",
  "securityAudit": "Specific security evaluation score and summary.",
  "bestPractices": "3-5 senior-level architectural improvements for modern, idiomatic code."
}

### SOURCE CODE TO AUDIT:
\`\`\`${language}
${code}
\`\`\`
`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', 
      messages: [
        { 
            role: 'system', 
            content: 'You are a Senior Principal Software Engineer and Security Architect at a top-tier tech firm. Your task is to perform deep technical audits. You are extremely critical, detail-oriented, and prioritize security and performance above all. You ALWAYS respond in strict, valid JSON.' 
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
    });

    const analysisData = JSON.parse(response.choices[0].message.content);

    // Save to database
    const analysis = await Analysis.create({
      userId: req.user.id,
      originalCode: code,
      language,
      ...analysisData
    });

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all analyses for a user
// @route   GET /api/analyze/history
// @access  Private
exports.getHistory = async (req, res, next) => {
  try {
    const history = await Analysis.find({ userId: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single analysis
// @route   GET /api/analyze/:id
// @access  Private
exports.getAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    // Make sure user owns the analysis
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this analysis' });
    }

    res.status(200).json({ success: true, data: analysis });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete analysis
// @route   DELETE /api/analyze/:id
// @access  Private
exports.deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    // Make sure user owns the analysis
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this analysis' });
    }

    await analysis.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Get analysis stats for a user
// @route   GET /api/analyze/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const totalAnalyses = await Analysis.countDocuments({ userId: req.user.id });
    const corrections = await Analysis.countDocuments({ 
        userId: req.user.id, 
        correctedCode: { $ne: null, $ne: "" } 
    });
    const optimizations = await Analysis.countDocuments({ 
        userId: req.user.id, 
        optimizedCode: { $ne: null, $ne: "" } 
    });

    res.status(200).json({
      success: true,
      data: {
        totalAnalyses,
        corrections,
        optimizations
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Chat with AI about an analysis
// @route   POST /api/analyze/:id/chat
// @access  Private
exports.chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    // Make sure user owns the analysis
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to chat about this analysis' });
    }

    const prompt = `
Context: You previously analyzed this ${analysis.language} code.
Original Code: 
${analysis.originalCode}

Your Previous Findings:
${analysis.findings}

User Question: ${message}

Provide a concise, highly technical, and helpful response to the user's question. Stay in character as a Senior Principal Engineer.
`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: 'You are a Senior Principal Software Engineer and Mentor. Your goal is to explain technical concepts clearly and help developers improve their code.' 
        },
        { role: 'user', content: prompt }
      ],
    });

    const aiResponse = response.choices[0].message.content;

    // Persist chat history
    analysis.chatHistory.push({ role: 'user', content: message });
    analysis.chatHistory.push({ role: 'ai', content: aiResponse });
    await analysis.save();

    res.status(200).json({
      success: true,
      data: aiResponse
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add comment to analysis
// @route   POST /api/analyze/:id/comment
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    const comment = {
      user: req.user.id,
      userName: req.user.name || 'User',
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

// @desc    Delete comment from analysis
// @route   DELETE /api/analyze/:id/comment/:commentId
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    const comment = analysis.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Make sure user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this comment' });
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

// @desc    Update comment in analysis
// @route   PATCH /api/analyze/:id/comment/:commentId
// @access  Private
exports.editComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    const comment = analysis.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Make sure user owns the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to edit this comment' });
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

// @desc    Toggle public visibility of analysis
// @route   PATCH /api/analyze/:id/toggle-public
// @access  Private
exports.togglePublic = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    // Make sure user owns the analysis
    if (analysis.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    analysis.isPublic = !analysis.isPublic;
    await analysis.save();

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public analysis
// @route   GET /api/analyze/public/:id
// @access  Public
exports.getPublicAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis || !analysis.isPublic) {
      return res.status(404).json({ success: false, message: 'Analysis not found or not public' });
    }

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

