const express = require('express');
const router = express.Router();
const prisma = require('../lib/db');

// Create Project
router.post('/create', async (req, res) => {
    try {
        const { userId, name, client, investment, startDate, endDate, description } = req.body;

        const project = await prisma.project.create({
            data: {
                userId,
                name,
                client,
                investment: parseFloat(investment),
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                description,
                status: 'active'
            }
        });

        res.json({ message: 'Project created successfully', project });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get All Projects
router.get('/all/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const projects = await prisma.project.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate ROI for each project
        const projectsWithROI = projects.map(p => {
            const roi = p.investment > 0 ? ((p.revenue - p.investment) / p.investment) * 100 : 0;
            const profit = p.revenue - p.expenses;
            return {
                ...p,
                roi: roi.toFixed(2),
                profit: profit.toFixed(2)
            };
        });

        res.json(projectsWithROI);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update Project
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, client, investment, status, endDate, description } = req.body;

        const project = await prisma.project.update({
            where: { id },
            data: {
                name,
                client,
                investment: investment ? parseFloat(investment) : undefined,
                status,
                endDate: endDate ? new Date(endDate) : undefined,
                description
            }
        });

        res.json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete Project
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.project.delete({
            where: { id }
        });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
