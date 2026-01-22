const express = require('express');
const router = express.Router();
const prisma = require('../lib/db');

// Add Client
router.post('/add', async (req, res) => {
    try {
        const { userId, name, email, phone, company } = req.body;

        const client = await prisma.client.create({
            data: {
                userId,
                name,
                email,
                phone,
                company
            }
        });

        res.json({ message: 'Client added successfully', client });
    } catch (error) {
        console.error('Error adding client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get All Clients
router.get('/all/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const clients = await prisma.client.findMany({
            where: { userId },
            orderBy: { totalRevenue: 'desc' }
        });
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Client
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, company } = req.body;

        const client = await prisma.client.update({
            where: { id },
            data: { name, email, phone, company }
        });

        res.json({ message: 'Client updated successfully', client });
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete Client
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.client.delete({
            where: { id }
        });
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
