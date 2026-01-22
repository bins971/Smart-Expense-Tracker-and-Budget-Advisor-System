const prisma = require('../lib/db');
const Groq = require('groq-sdk');

exports.getAdvice = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ message: 'AI configuration error: Missing Groq API Key' });
        }

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        // Fetch User's Data using Prisma
        const budget = await prisma.budget.findFirst({ where: { userId } });
        const expenses = await prisma.expense.findMany({ where: { userId } });
        const goals = await prisma.goal.findMany({ where: { userId } });
        const subscriptions = await prisma.subscription.findMany({ where: { userId } });

        if (!budget) {
            return res.status(200).json({
                advice: "### Welcome to your Financial Intelligence! \n\nIt looks like you haven't set a budget yet. To unlock deep insights, please set your budget first."
            });
        }

        const totalBudget = budget.totalAmount || 1;
        const currentBalance = budget.currentAmount;
        const totalSpent = Math.max(0, totalBudget - currentBalance);
        const burnRate = ((totalSpent / totalBudget) * 100).toFixed(1);

        // Advanced Category Breakdown
        const categoryMap = {};
        expenses.forEach(e => {
            categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
        });
        const topCategories = Object.entries(categoryMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([cat, amt]) => `${cat}: ₱${amt.toLocaleString()}`)
            .join(', ');

        // Subscription Impact
        const monthlySubs = subscriptions.reduce((acc, sub) => {
            return acc + (sub.cycle === 'Monthly' ? sub.amount : sub.amount / 12);
        }, 0);

        // Goal Status
        const goalSummary = goals.length > 0
            ? goals.map(g => `${g.name} (${Math.round((g.saved / g.amount) * 100)}%)`).join(' | ')
            : "No active goals";

        const prompt = `You are "AI Financial Intelligence", a world-class financial analyst. 
Analyze this user's data and provide a "Wealth Intelligence Report".

USER PROFILE:
- Budget: ₱${totalBudget.toLocaleString()}
- Available: ₱${currentBalance.toLocaleString()}
- Burn Rate: ${burnRate}%
- Top Categories: ${topCategories || 'No spending yet'}
- Fixed Subscriptions: ₱${monthlySubs.toLocaleString()}/mo
- Goal Progress: ${goalSummary}

STRUCTURE YOUR RESPONSE AS:
### 📊 Executive Summary
(One high-impact paragraph analyzing the current balance vs. time elapsed in the budget period. Be sharp and professional.)

### 🔍 Spending Pattern Analysis
(Identify "leaks" or spikes. Highlight the impact of top categories on the overall wealth trajectory.)

### 🚀 Wealth-Building Power Moves
- **Move 1**: (Specific tactical advice based on goals or category spent)
- **Move 2**: (Optimization tip for subscriptions or daily spending habit)
- **Move 3**: (Strategic long-term mindset shift or goal adjustment)

### 🔮 Predictive Forecast
(Forecast where they will be by end-of-period if current behavior continues. Use bold numbers.)

FORMATTING:
- Use professional, data-driven Markdown.
- Focus on "Empowerment" through data, not just criticism.
- Ensure headers are clear (###).`;

        console.log('[AI Advisor] Requesting insights from Groq...');

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a professional financial analyst providing wealth intelligence reports."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });

        const advice = completion.choices[0].message.content;
        console.log('[AI Advisor] ✓ Successfully generated insights');

        res.json({ advice });

    } catch (error) {
        console.error('Advisor Error:', error);
        res.status(500).json({ message: error.message || 'Intelligence engine failed.' });
    }
};

exports.getForecast = async (req, res) => {
    try {
        const { userId } = req.params;

        const [budget, expenses, subscriptions] = await Promise.all([
            prisma.budget.findFirst({ where: { userId } }),
            prisma.expense.findMany({
                where: { userId },
                orderBy: { date: 'asc' }
            }),
            prisma.subscription.findMany({ where: { userId } })
        ]);

        if (!budget) {
            return res.status(200).json({ predictedAmount: 0, trend: 'neutral', message: 'No budget set' });
        }

        // Use budget period dates for accurate calculation
        const budgetStart = new Date(budget.startDate || budget.startdate);
        const budgetEnd = new Date(budget.endDate || budget.enddate);
        const today = new Date();

        // Calculate total days in budget period
        const totalBudgetDays = Math.max(1, Math.ceil((budgetEnd - budgetStart) / (1000 * 60 * 60 * 24)));

        // Calculate days elapsed in budget period (capped at today if budget is still active)
        const effectiveEnd = today < budgetEnd ? today : budgetEnd;
        const daysElapsed = Math.max(1, Math.ceil((effectiveEnd - budgetStart) / (1000 * 60 * 60 * 24)));

        // Calculate remaining days
        const daysRemaining = Math.max(0, Math.ceil((budgetEnd - today) / (1000 * 60 * 60 * 24)));

        // Filter expenses within budget period
        const budgetExpenses = expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate >= budgetStart && expenseDate <= effectiveEnd;
        });

        const totalSpent = budgetExpenses.reduce((acc, curr) => acc + curr.amount, 0);
        const avgDaily = daysElapsed > 0 ? totalSpent / daysElapsed : 0;

        // Account for subscriptions
        // Calculate expected subscription charges for remaining period
        let futureSubCharges = 0;
        subscriptions.forEach(sub => {
            if (sub.cycle === 'Monthly') {
                const monthsRemaining = daysRemaining / 30;
                futureSubCharges += sub.amount * monthsRemaining;
            } else if (sub.cycle === 'Yearly') {
                const subStart = new Date(sub.startDate);
                if (subStart >= today && subStart <= budgetEnd) {
                    futureSubCharges += sub.amount;
                }
            }
        });

        // Predict total spending by end of budget period
        const predictedRemainingSpending = (avgDaily * daysRemaining) + futureSubCharges;
        const predictedTotalSpending = totalSpent + predictedRemainingSpending;

        // Spendable budget (after savings target)
        const savingsTarget = budget.savingsTarget || 0;
        const spendableBudget = budget.totalAmount - savingsTarget;

        // Determination of trend and status message
        let trend = 'neutral';
        let statusMessage = 'On Track';
        const budgetPercent = spendableBudget > 0 ? (totalSpent / spendableBudget) * 100 : 0;
        const timePercent = (daysElapsed / totalBudgetDays) * 100;

        if (budgetPercent > timePercent + 10) {
            trend = 'up';
            statusMessage = 'Overspending Warning';
        } else if (budgetPercent > timePercent) {
            trend = 'caution';
            statusMessage = 'Slightly Ahead of Schedule';
        } else if (budgetPercent > 0) {
            trend = 'down';
            statusMessage = 'On Track';
        }

        // Neural Wealth Architecture: 12-Month Projection
        // Based on current savings velocity = (Budget - (Average Monthly Expenses))
        const monthlyBudget = (budget.totalAmount / totalBudgetDays) * 30;
        const monthlyExpenses = avgDaily * 30;
        const projectedMonthlySavings = Math.max(0, monthlyBudget - monthlyExpenses);

        const projection = [];
        let currentNetWorth = budget.currentAmount;
        for (let i = 1; i <= 12; i++) {
            currentNetWorth += projectedMonthlySavings;
            projection.push({
                month: `Month ${i}`,
                netWorth: Math.round(currentNetWorth)
            });
        }

        // Anomaly Detection
        const recentThreshold = 3; // days
        const recentExpenses = budgetExpenses.filter(e => {
            const expDate = new Date(e.date);
            const diff = (today - expDate) / (1000 * 60 * 60 * 24);
            return diff <= recentThreshold;
        });
        const highValueAnomalies = recentExpenses.filter(e => e.amount >= 1000 || e.isHighValue);
        const anomalyAlert = highValueAnomalies.length > 0
            ? `Detected ${highValueAnomalies.length} high-value transaction(s) in the last 72 hours.`
            : null;

        res.status(200).json({
            predictedAmount: Math.round(predictedTotalSpending),
            avgDaily: Math.round(avgDaily),
            daysRemaining,
            totalBudgetDays,
            daysElapsed,
            spendableBudget: Math.round(spendableBudget),
            trend,
            statusMessage,
            burnRate: budgetPercent.toFixed(1),
            timePercent: timePercent.toFixed(1),
            projection,
            anomalyAlert,
            savingsVelocity: Math.round(projectedMonthlySavings)
        });

    } catch (error) {
        console.error("Error generating forecast:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
