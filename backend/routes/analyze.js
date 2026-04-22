const express = require('express');
const { analyzeCode, getHistory, getAnalysis, deleteAnalysis, getStats, chatWithAI, addComment, deleteComment, editComment } = require('../controllers/analyze');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', analyzeCode);
router.get('/history', getHistory);
router.get('/stats', getStats);
router.get('/:id', getAnalysis);
router.delete('/:id', deleteAnalysis);
router.post('/:id/chat', chatWithAI);
router.post('/:id/comment', addComment);
router.delete('/:id/comment/:commentId', deleteComment);
router.patch('/:id/comment/:commentId', editComment);

module.exports = router;
