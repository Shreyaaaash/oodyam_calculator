const express = require('express');
const { getSheetData } = require('../services/googleSheetsService');
const router = express.Router();

// GET /api/sheets/vendors
router.get('/vendors', async (req, res, next) => {
  try {
    const data = await getSheetData('Detail!A2:A');
    const vendors = [...new Set(data.flat().filter(Boolean))];
    res.json(vendors);
  } catch (error) {
    next(error);
  }
});

// GET /api/sheets/pump-capacities/:vendor
router.get('/pump-capacities/:vendor', async (req, res, next) => {
  try {
    const { vendor } = req.params;
    const data = await getSheetData('Detail!A2:B');
    const capacities = data
      .filter(row => row[0] === vendor)
      .map(row => row[1])
      .filter((value, index, self) => self.indexOf(value) === index);
    
    res.json(capacities);
  } catch (error) {
    next(error);
  }
});

// GET /api/sheets/pump-types/:vendor/:capacity
router.get('/pump-types/:vendor/:capacity', async (req, res, next) => {
  try {
    const { vendor, capacity } = req.params;
    const data = await getSheetData('Detail!A2:C');
    const types = data
      .filter(row => row[0] === vendor && row[1] === capacity)
      .map(row => row[2])
      .filter((value, index, self) => self.indexOf(value) === index);
    
    res.json(types);
  } catch (error) {
    next(error);
  }
});

// GET /api/sheets/meter-heads/:vendor/:capacity/:type
router.get('/meter-heads/:vendor/:capacity/:type', async (req, res, next) => {
  try {
    const { vendor, capacity, type } = req.params;
    const data = await getSheetData('Detail!A2:D');
    const meterHeads = data
      .filter(row => row[0] === vendor && row[1] === capacity && row[2] === type)
      .map(row => row[3])
      .filter((value, index, self) => self.indexOf(value) === index);
    
    res.json(meterHeads);
  } catch (error) {
    next(error);
  }
});

// GET /api/sheets/transport-charges
router.get('/transport-charges', async (req, res, next) => {
  try {
    const data = await getSheetData('Transport!A2:B');
    const charges = data.map(([distance, charge]) => ({
      distance,
      charge: parseInt(charge) || 0
    }));
    
    res.json(charges);
  } catch (error) {
    next(error);
  }
});

module.exports = router;