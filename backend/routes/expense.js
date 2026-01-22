const express = require('express');
const router = express.Router();
const prisma = require('../lib/db');

router.post("/add", async (req, res) => {
  try {
    const { user, category, name, amount, date, description, mood, isHighValue } = req.body;

    const budget = await prisma.budget.findFirst({ where: { userId: user } });
    if (!budget) {
      return res.status(404).json({ error: "No budget found for this user." });
    }

    if (budget.currentAmount < amount) {
      return res.status(400).json({ error: "Insufficient budget for this expense." });
    }

    const newExpense = await prisma.expense.create({
      data: {
        userId: user,
        category,
        name,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        description,
        mood,
        isHighValue: !!isHighValue
      }
    });

    // Update budget
    await prisma.budget.update({
      where: { id: budget.id },
      data: { currentAmount: budget.currentAmount - parseFloat(amount) }
    });

    res.status(201).json({
      message: "Expense added and budget updated!",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/daily-expenses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const budget = await prisma.budget.findFirst({ where: { userId } });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found for the user.' });
    }

    const { startDate, endDate } = budget;
    const subscriptions = await prisma.subscription.findMany({ where: { userId } });

    // Get expenses grouped by date
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: { gte: new Date(startDate), lte: new Date(endDate) }
      }
    });

    // Group by date
    const dailyMap = {};
    expenses.forEach(exp => {
      const dateStr = new Date(exp.date).toISOString().split('T')[0];
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + exp.amount;
    });

    const start = new Date(startDate);
    const end = new Date(endDate);

    subscriptions.forEach(sub => {
      if (sub.cycle === 'Monthly') {
        let temp = new Date(start);
        while (temp <= end) {
          const subDate = new Date(temp.getFullYear(), temp.getMonth(), new Date(sub.startDate).getDate());
          if (subDate >= start && subDate <= end) {
            const dateStr = subDate.toISOString().split('T')[0];
            dailyMap[dateStr] = (dailyMap[dateStr] || 0) + sub.amount;
          }
          temp.setMonth(temp.getMonth() + 1);
        }
      } else if (sub.cycle === 'Yearly') {
        const subStart = new Date(sub.startDate);
        const subDate = new Date(start.getFullYear(), subStart.getMonth(), subStart.getDate());
        if (subDate >= start && subDate <= end) {
          const dateStr = subDate.toISOString().split('T')[0];
          dailyMap[dateStr] = (dailyMap[dateStr] || 0) + sub.amount;
        }
      }
    });

    const dailyExpenses = Object.keys(dailyMap).sort().map(date => ({
      _id: date,
      totalAmount: dailyMap[date]
    }));

    res.json({
      user: userId,
      budgetPeriod: { startDate, endDate },
      dailyExpenses,
    });
  } catch (error) {
    console.error('Error fetching daily expenses:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/all/:user', async (req, res) => {
  try {
    const { user: userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const budget = await prisma.budget.findFirst({ where: { userId } });

    let whereClause = { userId };
    if (budget) {
      whereClause.date = { gte: new Date(budget.startDate), lte: new Date(budget.endDate) };
    }

    const [expenses, totalDBExpenses] = await Promise.all([
      prisma.expense.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        skip,
        take: limit
      }),
      prisma.expense.count({ where: whereClause })
    ]);

    // Add subscription costs as virtual transactions
    const subscriptions = await prisma.subscription.findMany({ where: { userId } });

    if (budget) {
      const start = new Date(budget.startDate);
      const end = new Date(budget.endDate);

      subscriptions.forEach(sub => {
        if (sub.cycle === 'Monthly') {
          let temp = new Date(start);
          while (temp <= end) {
            const subDate = new Date(temp.getFullYear(), temp.getMonth(), new Date(sub.startDate).getDate());
            if (subDate >= start && subDate <= end) {
              expenses.push({
                id: `sub-${sub.id}-${subDate.getTime()}`,
                userId: sub.userId,
                category: sub.category || 'Subscription',
                name: `${sub.name} (Subscription)`,
                amount: sub.amount,
                date: subDate,
                description: `Recurring ${sub.cycle} payment`,
                isSubscription: true
              });
            }
            temp.setMonth(temp.getMonth() + 1);
          }
        } else if (sub.cycle === 'Yearly') {
          const subStart = new Date(sub.startDate);
          const subDate = new Date(start.getFullYear(), subStart.getMonth(), subStart.getDate());
          if (subDate >= start && subDate <= end) {
            expenses.push({
              id: `sub-${sub.id}-${subDate.getTime()}`,
              userId: sub.userId,
              category: sub.category || 'Subscription',
              name: `${sub.name} (Subscription)`,
              amount: sub.amount,
              date: subDate,
              description: `Recurring ${sub.cycle} payment`,
              isSubscription: true
            });
          }
        }
      });
    }

    // Sort again
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      message: "Expenses fetched successfully!",
      expenses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalDBExpenses / limit),
        totalItems: totalDBExpenses,
        itemsPerPage: limit,
        note: "Subscriptions are appended to the current page of expenses."
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/category-percentage/:user', async (req, res) => {
  try {
    const { user: userId } = req.params;
    const budget = await prisma.budget.findFirst({ where: { userId } });

    let whereClause = { userId };
    if (budget) {
      whereClause.date = { gte: new Date(budget.startDate), lte: new Date(budget.endDate) };
    }

    const expenses = await prisma.expense.findMany({ where: whereClause });
    const subscriptions = await prisma.subscription.findMany({ where: { userId } });

    const categorySums = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) acc[expense.category] = 0;
      acc[expense.category] += expense.amount;
      return acc;
    }, {});

    if (budget) {
      const start = new Date(budget.startDate);
      const end = new Date(budget.endDate);

      subscriptions.forEach(sub => {
        let count = 0;
        if (sub.cycle === 'Monthly') {
          let temp = new Date(start);
          while (temp <= end) {
            const subDate = new Date(temp.getFullYear(), temp.getMonth(), new Date(sub.startDate).getDate());
            if (subDate >= start && subDate <= end) count++;
            temp.setMonth(temp.getMonth() + 1);
          }
        } else if (sub.cycle === 'Yearly') {
          const subStart = new Date(sub.startDate);
          const subDate = new Date(start.getFullYear(), subStart.getMonth(), subStart.getDate());
          if (subDate >= start && subDate <= end) count++;
        }

        if (count > 0) {
          const category = sub.category || 'Subscription';
          if (!categorySums[category]) categorySums[category] = 0;
          categorySums[category] += sub.amount * count;
        }
      });
    }

    const totalAmount = Object.values(categorySums).reduce((total, amt) => total + amt, 0);

    const categoryPercentages = Object.keys(categorySums).map(category => {
      const categoryAmount = categorySums[category];
      const percentage = totalAmount > 0 ? (categoryAmount / totalAmount) * 100 : 0;
      return { category, amount: categoryAmount, percentage: percentage.toFixed(2) };
    });

    res.status(200).json({
      message: "Category percentages calculated successfully!",
      categoryPercentages,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/duration/:user', async (req, res) => {
  try {
    const { user } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Please provide both startDate and endDate in query parameters." });
    }

    const expenses = await prisma.expense.findMany({
      where: {
        userId: user,
        date: { gte: new Date(startDate), lte: new Date(endDate) }
      }
    });

    if (!expenses.length) {
      return res.status(404).json({ error: "No expenses found for the specified duration." });
    }

    res.status(200).json({
      message: "Expenses for the specified duration fetched successfully!",
      expenses,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({
      message: "Expense updated successfully!",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error(error.message);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Expense not found." });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await prisma.expense.findUnique({ where: { id } });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found." });
    }

    // Add amount back to budget
    const budget = await prisma.budget.findFirst({ where: { userId: expense.userId } });
    if (budget) {
      await prisma.budget.update({
        where: { id: budget.id },
        data: { currentAmount: budget.currentAmount + expense.amount }
      });
    }

    await prisma.expense.delete({ where: { id } });

    res.status(200).json({ message: "Expense deleted successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
