const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/db');

const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
    const { username, email, password, gender, age, dob, workingStatus } = req.body;

    try {
        if (!username || !email || !password || !gender || !age || !dob || !workingStatus) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                gender,
                age: Number(age),
                dob: new Date(dob),
                workingStatus: workingStatus.trim() || '',
            }
        });

        const payload = {
            user: {
                id: newUser.id,
                username: newUser.username,
            },
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(400).json({
            message: error.message,
            validationErrors: error.errors
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

exports.getUserByEmail = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { email: req.params.email } });
        if (user) {
            return res.json({ user_id: user.id });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id } });
        if (user) {
            return res.json(user);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const email = req.params.email;
        const updatedData = { ...req.body };

        delete updatedData.email;
        delete updatedData.password;

        const user = await prisma.user.update({
            where: { email },
            data: updatedData,
        });

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating user profile:', error);

        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'User not found' });
        }
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Duplicate email detected' });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
