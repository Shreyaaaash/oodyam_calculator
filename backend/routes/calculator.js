const express = require('express');
const { calculateCost } = require('../services/calculationService');
const router = express.Router();

// POST /api/calculator/calculate
router.post('/calculate', async (req, res, next) => {
  try {
    const formData = req.body;
    const result = await calculateCost(formData);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;