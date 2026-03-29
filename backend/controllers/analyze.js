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

Provide output in JSON format:

{
  "findings": "List of errors found",
  "explanation": "Explain errors in simple English",
  "correctedCode": "Fixed version of code",
  "optimizedCode": "More optimized version",
  "timeComplexity": "Big-O time complexity",
  "spaceComplexity": "Big-O space complexity",
  "confidenceScore": "0-100%"
}

Code:
${code}
`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', 
      messages: [
        { role: 'system', content: 'You are an expert programming debugger and architect.' },
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
