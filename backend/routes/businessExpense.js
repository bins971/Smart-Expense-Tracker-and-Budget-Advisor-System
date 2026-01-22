const express = require('express');
const router = express.Router();
const prisma = require('../lib/db');

// Add Business Expense
router.post('/add', async (req, res) => {
    try {
        const { userId, amount, category, expenseType, vendor, projectId, date, description, isTaxDeductible, receiptUrl } = req.body;

        const expense = await prisma.businessExpense.create({
            data: {
                userId,
                amount: parseFloat(amount),
                category: category || 'Other',
                expenseType: expenseType || 'Operating',
                vendor: vendor || null,
                projectId: projectId || null,
                date: new Date(date),
                description: description || null,
                isTaxDeductible: isTaxDeductible !== undefined ? isTaxDeductible : true,
                receiptUrl: receiptUrl || null
            }
        });

        // Update project expenses if projectId specified
        if (projectId) {
            const project = await prisma.project.findUnique({
                where: { id: projectId }
            });

            if (project) {
                await prisma.project.update({
                    where: { id: projectId },
                    data: { expenses: project.expenses + parseFloat(amount) }
                });
            }
        }

        res.json({ message: 'Business expense added successfully', expense });
    } catch (error) {
        console.error('Error adding business expense:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get All Business Expenses
router.get('/all/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const expenses = await prisma.businessExpense.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching business expenses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Expenses by Type (COGS vs Operating)
router.get('/by-type/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const expenses = await prisma.businessExpense.findMany({
            where: { userId }
        });

        const byType = {
            COGS: 0,
            Operating: 0,
            Capital: 0
        };

        expenses.forEach(e => {
            byType[e.expenseType] = (byType[e.expenseType] || 0) + e.amount;
        });

        res.json(byType);
    } catch (error) {
        console.error('Error fetching expenses by type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete Business Expense
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.businessExpense.delete({
            where: { id }
        });
        res.json({ message: 'Business expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting business expense:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
