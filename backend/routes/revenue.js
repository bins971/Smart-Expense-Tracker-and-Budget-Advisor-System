const express = require('express');
const router = express.Router();
const prisma = require('../lib/db');

// Add Revenue
router.post('/add', async (req, res) => {
    try {
        const { userId, amount, source, category, client, projectId, invoiceNumber, date, description, isPaid, paymentMethod } = req.body;

        const revenue = await prisma.revenue.create({
            data: {
                userId,
                amount: parseFloat(amount),
                source: source || 'Other',
                category: category || 'Other',
                client: client || null,
                projectId: projectId || null,
                invoiceNumber: invoiceNumber || null,
                date: new Date(date),
                description: description || null,
                isPaid: isPaid !== undefined ? isPaid : true,
                paymentMethod: paymentMethod || null
            }
        });

        // Update client total revenue if client specified
        if (client) {
            const existingClient = await prisma.client.findFirst({
                where: { userId, name: client }
            });

            if (existingClient) {
                await prisma.client.update({
                    where: { id: existingClient.id },
                    data: {
                        totalRevenue: existingClient.totalRevenue + parseFloat(amount),
                        lastPurchase: new Date(date)
                    }
                });
            }
        }

        // Update project revenue if projectId specified
        if (projectId) {
            const project = await prisma.project.findUnique({
                where: { id: projectId }
            });

            if (project) {
                await prisma.project.update({
                    where: { id: projectId },
                    data: { revenue: project.revenue + parseFloat(amount) }
                });
            }
        }

        res.json({ message: 'Revenue added successfully', revenue });
    } catch (error) {
        console.error('Error adding revenue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get All Revenue
router.get('/all/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const revenues = await prisma.revenue.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
        res.json(revenues);
    } catch (error) {
        console.error('Error fetching revenue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Revenue by Category
router.get('/by-category/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const revenues = await prisma.revenue.findMany({
            where: { userId }
        });

        const byCategory = {};
        revenues.forEach(r => {
            byCategory[r.category] = (byCategory[r.category] || 0) + r.amount;
        });

        res.json(byCategory);
    } catch (error) {
        console.error('Error fetching revenue by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete Revenue
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.revenue.delete({
            where: { id }
        });
        res.json({ message: 'Revenue deleted successfully' });
    } catch (error) {
        console.error('Error deleting revenue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
