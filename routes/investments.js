const express = require('express');
const Investment = require('../models/Investment');
const auth = require('../middleware/auth');
const router = express.Router();

// All routes use auth middleware
router.use(auth);

// GET /api/investments
router.get('/', async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user._id });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/investments
router.post('/', async (req, res) => {
  try {
    // Added accountType to the destructuring
    const {
      accountNo,
      bankName,
      openDate,
      maturityDate,
      term,
      initialAmount,
      interestRate,
      interestAmount,
      maturityAmount,
      nominee,
      notes,
      accountType  
    } = req.body;

    const investment = new Investment({
      userId: req.user._id,
      accountNo,
      bankName,
      openDate,
      maturityDate,
      term,
      initialAmount,
      interestRate,
      interestAmount,
      maturityAmount,
      nominee,
      notes,
      accountType   
    });

    await investment.save();
    res.status(201).json(investment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/investments/:id
router.put('/:id', async (req, res) => {
  try {
    const investment = await Investment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!investment) return res.status(404).json({ error: 'Investment not found' });

    const updates = req.body;
    Object.assign(investment, updates); // accountType will be updated if present
    await investment.save();
    res.json(investment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/investments/:id
router.delete('/:id', async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!investment) return res.status(404).json({ error: 'Investment not found' });
    res.json({ message: 'Investment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;