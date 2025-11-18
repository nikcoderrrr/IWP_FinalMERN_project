const express = require('express');
const { generateTitle } = require('../controllers/aiController');

const router = express.Router();

// POST /api/ai/generate-title
router.post('/generate-title', generateTitle);

module.exports = router;