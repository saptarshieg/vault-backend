const express = require('express');
const Password = require('../models/Password');
const auth = require('../middleware/auth');
const { encrypt, decrypt } = require('../utils/encryption');
const router = express.Router();

router.use(auth);

// GET /api/passwords
router.get('/', async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user._id });
    // Decrypt each password before sending
    const decrypted = passwords.map(p => ({
      ...p.toObject(),
      password: decrypt(p.encryptedPassword, p.iv)
    }));
    res.json(decrypted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/passwords
router.post('/', async (req, res) => {
  try {
    const { title, url, category, username, password, notes } = req.body;
    if (!title || !password) {
      return res.status(400).json({ error: 'Title and password are required' });
    }

    const { iv, encryptedData } = encrypt(password);
    const newPassword = new Password({
      userId: req.user._id,
      title,
      url,
      category,
      username,
      encryptedPassword: encryptedData,
      iv,
      notes
    });
    await newPassword.save();

    // Return the decrypted password for the response
    const response = { ...newPassword.toObject(), password };
    delete response.encryptedPassword;
    delete response.iv;
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/passwords/:id
router.put('/:id', async (req, res) => {
  try {
    const password = await Password.findOne({ _id: req.params.id, userId: req.user._id });
    if (!password) return res.status(404).json({ error: 'Password entry not found' });

    const { title, url, category, username, password: plainPassword, notes } = req.body;
    // Update fields
    if (title) password.title = title;
    if (url) password.url = url;
    if (category) password.category = category;
    if (username) password.username = username;
    if (notes) password.notes = notes;

    // If password is provided, re-encrypt it
    if (plainPassword) {
      const { iv, encryptedData } = encrypt(plainPassword);
      password.encryptedPassword = encryptedData;
      password.iv = iv;
    }

    await password.save();

    // Return decrypted version
    const decryptedPassword = decrypt(password.encryptedPassword, password.iv);
    const response = { ...password.toObject(), password: decryptedPassword };
    delete response.encryptedPassword;
    delete response.iv;
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/passwords/:id
router.delete('/:id', async (req, res) => {
  try {
    const password = await Password.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!password) return res.status(404).json({ error: 'Password entry not found' });
    res.json({ message: 'Password entry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;