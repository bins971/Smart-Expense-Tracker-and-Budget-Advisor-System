const prisma = require('../lib/db');
const Groq = require('groq-sdk');

exports.generateSummary = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get the most recent budget (active or expired)
        const budget = await prisma.budget.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        if (!budget) {
            return res.status(404).json({ message: 'No budget found' });
        }

        // Get all expenses from the budget period
        const expenses = await prisma.expense.findMany({
            where: {
                userId,
                date: {
                    gte: new Date(budget.startDate),
                    lte: new Date(budget.endDate)
                }
            }
        });

        // Get subscriptions for the period
        const subscriptions = await prisma.subscription.findMany({
            where: { userId }
        });

        // Calculate subscription costs for the period
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

        // Calculate metrics
        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0) + subscriptionTotal;
        const savingsAchieved = budget.totalAmount - totalSpent;
        const savingsPercent = (savingsAchieved / budget.totalAmount) * 100;

        // Category breakdown
        const categoryBreakdown = {};
        expenses.forEach(e => {
            categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
        });

        // Add subscriptions to breakdown
        if (subscriptionTotal > 0) {
            categoryBreakdown['Subscriptions'] = subscriptionTotal;
        }

        // Achievement medal
        let achievement = "✅ Budget Finisher";
        if (savingsPercent >= 30) achievement = "🥇 Gold Medal";
        else if (savingsPercent >= 15) achievement = "🥈 Silver Medal";
        else if (savingsPercent >= 5) achievement = "🥉 Bronze Medal";

        // Generate AI advice
        let aiAdvice = null;
        if (process.env.GROQ_API_KEY) {
            try {
                aiAdvice = await generateBudgetAdvice({
                    totalBudget: budget.totalAmount,
                    totalSpent,
                    savingsAchieved,
                    savingsPercent,
                    categoryBreakdown,
                    savingsTarget: budget.savingsTarget || 0
                });
            } catch (error) {
                console.error('Error generating AI advice:', error);
                aiAdvice = "AI advice temporarily unavailable.";
            }
        }

        res.json({
            period: {
                start: budget.startDate,
                end: budget.endDate,
                totalBudget: budget.totalAmount,
                savingsTarget: budget.savingsTarget || 0
            },
            spending: {
                total: totalSpent,
                savingsAchieved,
                savingsPercent: savingsPercent.toFixed(1),
                categoryBreakdown
            },
            achievement,
            aiAdvice,
            expenseCount: expenses.length
        });

    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const generateBudgetAdvice = async (data) => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const categoryList = Object.entries(data.categoryBreakdown)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, amt]) => `- ${cat}: ₱${amt.toLocaleString()} (${((amt / data.totalSpent) * 100).toFixed(1)}%)`)
        .join('\n');

    const prompt = `You are a professional financial advisor. Analyze this budget period and provide actionable advice.

BUDGET SUMMARY:
- Total Budget: ₱${data.totalBudget.toLocaleString()}
- Total Spent: ₱${data.totalSpent.toLocaleString()}
- Savings Achieved: ₱${data.savingsAchieved.toLocaleString()} (${data.savingsPercent.toFixed(1)}%)
- Savings Target: ₱${data.savingsTarget.toLocaleString()}

CATEGORY BREAKDOWN:
${categoryList}

Provide a concise analysis with:
## 📊 Performance Analysis
(2-3 sentences on overall performance)

## 🔍 Top 3 Insights
1. **[Category/Pattern]**: [Specific observation]
2. **[Category/Pattern]**: [Specific observation]
3. **[Category/Pattern]**: [Specific observation]

## 🚀 Future Budget Recommendations
1. **[Action]**: [Specific recommendation with numbers]
2. **[Action]**: [Specific recommendation with numbers]
3. **[Action]**: [Specific recommendation with numbers]

Be encouraging, specific, and actionable. Use Philippine Peso (₱) for amounts.`;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are a professional financial advisor providing budget analysis and recommendations."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 1000
    });

    return completion.choices[0].message.content;
};

module.exports = exports;
