const express = require('express');
const { signup, login, getUserByEmail, getUserById, updateUser, generate2FA, verify2FA } = require('../controllers/authController');

const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Fetch User by Email Route
router.get('/by-email/:email', getUserByEmail);

// User by Profile (ID) Route
router.get('/by-profile/:id', getUserById);

// Update User Route
router.put('/update/:email', updateUser);

// 2FA Routes
router.post('/2fa/generate', generate2FA);
router.post('/2fa/verify', verify2FA);

module.exports = router;