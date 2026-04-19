const express = require('express');
const { analyzeCode, getHistory, getAnalysis, deleteAnalysis, getStats } = require('../controllers/analyze');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', analyzeCode);
router.get('/history', getHistory);
router.get('/stats', getStats);
router.get('/:id', getAnalysis);
router.delete('/:id', deleteAnalysis);

module.exports = router;
