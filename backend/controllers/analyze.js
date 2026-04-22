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
    console.log(`DEBUG: ANALYZE REQUEST - User ID: ${req.user.id}, Email: ${req.user.email}, Language: ${language}`);

    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Please provide code and language' });
    }

    const prompt = `
Analyze the following code written in ${language}. 

### INSTRUCTIONS:
1. **DEEP ANALYSIS**: Identify syntax errors, logical bugs, security vulnerabilities (OWASP Top 10), and performance bottlenecks.
2. **REASONING**: Before providing the final JSON, mentally simulate the execution and think through edge cases.
3. **CORRECTION**: Provide a corrected version that is production-ready.
4. **OPTIMIZATION**: Provide an optimized version with better time/space complexity if possible.

### OUTPUT FORMAT:
You must respond with a SINGLE JSON object. No markdown, no prose outside the JSON.

{
  "findings": "Detailed, bulleted list of all identified issues (bugs, security, logic).",
  "explanation": "Clear, technical breakdown of why these issues occur and the logic behind the fixes.",
  "correctedCode": "The complete fixed version of the code.",
  "expectedOutput": "The exact output the corrected code is expected to produce when executed (e.g., console logs, return values).",
  "optimizedCode": "A performance-optimized version (if applicable).",
  "timeComplexity": "Big-O notation (e.g., O(n log n)) with brief justification.",
  "spaceComplexity": "Big-O notation with brief justification.",
  "confidenceScore": "A percentage (e.g., 95%) reflecting your certainty.",
  "securityAudit": "Specific security evaluation (e.g., 'Vulnerable to SQL Injection', 'Secure').",
  "bestPractices": "List of 3-5 specific improvements for modern, idiomatic code."
}

### CODE TO ANALYZE:
\`\`\`${language}
${code}
\`\`\`
`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', 
      messages: [
        { 
            role: 'system', 
            content: 'You are a Senior Principal Software Engineer and Security Architect. Your task is to perform deep technical audits of code. You are extremely critical, detail-oriented, and follow industry best practices. You ALWAYS respond in valid JSON format.' 
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

    res.status(200).json({
      success: true,
      data: response.choices[0].message.content
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

