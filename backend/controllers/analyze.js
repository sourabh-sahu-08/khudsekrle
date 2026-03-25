const OpenAI = require('openai');
const Analysis = require('../models/Analysis');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

    const prompt = `
Analyze the following code written in ${language}.

Provide output in JSON format:

{
  "errors": "List of errors found",
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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // or gpt-3.5-turbo
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
