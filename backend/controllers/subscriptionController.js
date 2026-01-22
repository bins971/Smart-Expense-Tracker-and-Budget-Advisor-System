const prisma = require('../lib/db');

// Add a new subscription
exports.addSubscription = async (req, res) => {
    const { user, name, amount, cycle, startDate } = req.body;

    try {
        const start = startDate ? new Date(startDate) : new Date();
        const nextDate = new Date(start);
        if (cycle === 'Monthly') {
            nextDate.setMonth(nextDate.getMonth() + 1);
        } else if (cycle === 'Yearly') {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
        }

        const newSubscription = await prisma.subscription.create({
            data: {
                userId: user,
                name,
                amount: parseFloat(amount),
                cycle: cycle || 'Monthly',
                category: req.body.category || 'Subscription',
                startDate: start,
                nextPaymentDate: nextDate
            }
        });

        res.status(201).json(newSubscription);
    } catch (error) {
        console.error("Error adding subscription:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get all subscriptions for a user
exports.getSubscriptions = async (req, res) => {
    const { userId } = req.params;

    try {
        const subscriptions = await prisma.subscription.findMany({
            where: { userId },
            orderBy: { nextPaymentDate: 'asc' }
        });
        res.status(200).json(subscriptions);
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete a subscription
exports.deleteSubscription = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.subscription.delete({ where: { id } });
        res.status(200).json({ message: "Subscription Deleted" });
    } catch (error) {
        console.error("Error deleting subscription:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Subscription not found" });
        }
        res.status(500).json({ message: "Server Error" });
    }
};
