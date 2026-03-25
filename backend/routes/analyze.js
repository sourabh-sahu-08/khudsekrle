const express = require('express');
const { analyzeCode, getHistory } = require('../controllers/analyze');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', analyzeCode);
router.get('/history', getHistory);

module.exports = router;
