const express = require('express');
const router = express.Router();
const prisma = require('../lib/db');

router.post('/create', async (req, res) => {
  const { user: userId, totalAmount, currentAmount, startDate, endDate, savingsTarget = 0 } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check for existing budget and archive it
    const existingBudget = await prisma.budget.findFirst({ where: { userId } });
    if (existingBudget) {
      // Get expenses to archive
      const expenses = await prisma.expense.findMany({ where: { userId } });
      const subscriptions = await prisma.subscription.findMany({ where: { userId } });

      let archivedExpenses = expenses.map(e => ({
        category: e.category,
        name: e.name,
        amount: e.amount,
        date: e.date,
        description: e.description
      }));

      // Add subscription virtual transactions to history
      const start = new Date(existingBudget.startDate);
      const end = new Date(existingBudget.endDate);

      subscriptions.forEach(sub => {
        if (sub.cycle === 'Monthly') {
          let temp = new Date(start);
          while (temp <= end) {
            const subDate = new Date(temp.getFullYear(), temp.getMonth(), new Date(sub.startDate).getDate());
            if (subDate >= start && subDate <= end) {
              archivedExpenses.push({
                category: sub.category || 'Subscription',
                name: `${sub.name} (Subscription)`,
                amount: sub.amount,
                date: subDate,
                description: `Recurring ${sub.cycle} payment`
              });
            }
            temp.setMonth(temp.getMonth() + 1);
          }
        } else if (sub.cycle === 'Yearly') {
          const subStart = new Date(sub.startDate);
          const subDate = new Date(start.getFullYear(), subStart.getMonth(), subStart.getDate());
          if (subDate >= start && subDate <= end) {
            archivedExpenses.push({
              category: sub.category || 'Subscription',
              name: `${sub.name} (Subscription)`,
              amount: sub.amount,
              date: subDate,
              description: `Recurring ${sub.cycle} payment`
            });
          }
        }
      });

      // Archive the old budget
      await prisma.budgetHistory.create({
        data: {
          userId,
          totalAmount: existingBudget.totalAmount,
          remainingAmount: existingBudget.currentAmount,
          startDate: existingBudget.startDate,
          endDate: existingBudget.endDate,
          expenses: archivedExpenses,
          achievement: (existingBudget.currentAmount / existingBudget.totalAmount * 100 >= 85) ? "Frugal Master" : null
        }
      });

      // Delete old budget and expenses
      await prisma.budget.delete({ where: { id: existingBudget.id } });
      await prisma.expense.deleteMany({ where: { userId } });
    }

    // Create new budget
    const budget = await prisma.budget.create({
      data: {
        userId,
        totalAmount: parseFloat(totalAmount),
        savingsTarget: parseFloat(savingsTarget) || 0,
        currentAmount: parseFloat(totalAmount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      }
    });

    res.status(201).json({ message: 'Budget set and data reset successfully!', budget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { totalAmount, startDate, endDate, savingsTarget } = req.body;
    const userId = req.params.id;

    const existingBudget = await prisma.budget.findFirst({ where: { userId } });
    if (!existingBudget) {
      return res.status(404).json({ error: 'Budget not found.' });
    }

    // Archive logic
    const expenses = await prisma.expense.findMany({ where: { userId } });
    const subscriptions = await prisma.subscription.findMany({ where: { userId } });

    let archivedExpenses = expenses.map(e => ({
      category: e.category,
      name: e.name,
      amount: e.amount,
      date: e.date,
      description: e.description
    }));

    const start = new Date(existingBudget.startDate);
    const end = new Date(existingBudget.endDate);

    subscriptions.forEach(sub => {
      if (sub.cycle === 'Monthly') {
        let temp = new Date(start);
        while (temp <= end) {
          const subDate = new Date(temp.getFullYear(), temp.getMonth(), new Date(sub.startDate).getDate());
          if (subDate >= start && subDate <= end) {
            archivedExpenses.push({
              category: sub.category || 'Subscription',
              name: `${sub.name} (Subscription)`,
              amount: sub.amount,
              date: subDate,
              description: `Recurring ${sub.cycle} payment`
            });
          }
          temp.setMonth(temp.getMonth() + 1);
        }
      } else if (sub.cycle === 'Yearly') {
        const subStart = new Date(sub.startDate);
        const subDate = new Date(start.getFullYear(), subStart.getMonth(), subStart.getDate());
        if (subDate >= start && subDate <= end) {
          archivedExpenses.push({
            category: sub.category || 'Subscription',
            name: `${sub.name} (Subscription)`,
            amount: sub.amount,
            date: subDate,
            description: `Recurring ${sub.cycle} payment`
          });
        }
      }
    });

    const remainingPercent = (existingBudget.currentAmount / existingBudget.totalAmount) * 100;
    let achievement = null;
    if (remainingPercent >= 30) achievement = "🥇 Gold Medal";
    else if (remainingPercent >= 15) achievement = "🥈 Silver Medal";
    else if (remainingPercent >= 5) achievement = "🥉 Bronze Medal";
    else achievement = "✅ Budget Finisher";

    await prisma.budgetHistory.create({
      data: {
        userId,
        totalAmount: existingBudget.totalAmount,
        remainingAmount: existingBudget.currentAmount,
        startDate: existingBudget.startDate,
        endDate: existingBudget.endDate,
        expenses: archivedExpenses,
        achievement
      }
    });

    await prisma.expense.deleteMany({ where: { userId } });

    // Update budget
    const updatedBudget = await prisma.budget.update({
      where: { id: existingBudget.id },
      data: {
        totalAmount: totalAmount ? parseFloat(totalAmount) : existingBudget.totalAmount,
        currentAmount: totalAmount ? parseFloat(totalAmount) : existingBudget.totalAmount,
        savingsTarget: savingsTarget !== undefined ? parseFloat(savingsTarget) : existingBudget.savingsTarget,
        startDate: startDate ? new Date(startDate) : existingBudget.startDate,
        endDate: endDate ? new Date(endDate) : existingBudget.endDate,
      }
    });

    res.status(200).json({ message: 'Budget reset and history saved!', budget: updatedBudget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/fetch/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const budget = await prisma.budget.findFirst({ where: { userId } });

    if (budget) {
      const subscriptions = await prisma.subscription.findMany({ where: { userId } });

      let subscriptionTotal = 0;
      const start = new Date(budget.startDate);
      const end = new Date(budget.endDate);

      subscriptions.forEach(sub => {
        if (sub.cycle === 'Monthly') {
          let temp = new Date(start);
          while (temp <= end) {
            const subDate = new Date(temp.getFullYear(), temp.getMonth(), new Date(sub.startDate).getDate());
            if (subDate >= start && subDate <= end) subscriptionTotal += sub.amount;
            temp.setMonth(temp.getMonth() + 1);
          }
        } else if (sub.cycle === 'Yearly') {
          const subStart = new Date(sub.startDate);
          const subDate = new Date(start.getFullYear(), subStart.getMonth(), subStart.getDate());
          if (subDate >= start && subDate <= end) subscriptionTotal += sub.amount;
        }
      });

      const savingsTarget = budget.savingsTarget || 0;
      const spendableBudget = budget.totalAmount - savingsTarget;
      const adjustedCurrentAmount = Math.max(0, budget.currentAmount - subscriptionTotal - savingsTarget);

      return res.json({
        totalAmount: budget.totalAmount,
        savingsTarget: savingsTarget,
        spendableBudget: spendableBudget,
        currentAmount: adjustedCurrentAmount,
        startdate: budget.startDate,
        enddate: budget.endDate
      });
    } else {
      return res.status(404).json({ message: 'User budget not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      prisma.budgetHistory.findMany({
        where: { userId },
        orderBy: { archivedDate: 'desc' },
        skip,
        take: limit
      }),
      prisma.budgetHistory.count({ where: { userId } })
    ]);

    res.status(200).json({
      history,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;