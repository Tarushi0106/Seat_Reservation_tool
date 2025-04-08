const express = require('express');
const router = express.Router();
const { getPrediction } = require('../controllers/predictController'); // ✅ fixed path

router.post('/predict', getPrediction); // POST /api/predict

module.exports = router; // Use CommonJS export