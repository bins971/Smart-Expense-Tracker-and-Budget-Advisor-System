const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const Goal = require('../models/Goal');
const Groq = require('groq-sdk');
const connectDB = require('../config/db');

exports.getAdvice = async (req, res) => {
    await connectDB();
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

        // Fetch User's Budget
        const budget = await Budget.findOne({ user: userId });
        const expenses = await Expense.find({ user: userId });
        const goals = await Goal.find({ user: userId });
        const Subscription = require('../models/Subscription');
        const subscriptions = await Subscription.find({ user: userId });

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
    await connectDB();
    try {
        const { userId } = req.params;

        const expenses = await Expense.find({ user: userId }).sort({ date: 1 });
        const budget = await Budget.findOne({ user: userId });

        if (!expenses || expenses.length === 0) {
            return res.status(200).json({ predictedAmount: 0, trend: 'neutral', message: 'Not enough data' });
        }

        const firstDate = new Date(expenses[0].date);
        const lastDate = new Date();
        const daysDiff = Math.max(1, Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)));

        const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const avgDaily = totalSpent / daysDiff;

        const Subscription = require('../models/Subscription');
        const subscriptions = await Subscription.find({ user: userId });
        const monthlySubTotal = subscriptions.reduce((acc, sub) => {
            return acc + (sub.cycle === 'Monthly' ? sub.amount : sub.amount / 12);
        }, 0);

        const predictedAmount = (avgDaily * 30) + monthlySubTotal;

        let trend = 'neutral';
        if (budget) {
            if (predictedAmount > budget.totalAmount) trend = 'up';
            else if (predictedAmount < budget.totalAmount * 0.8) trend = 'down';
        }

        res.status(200).json({
            predictedAmount: Math.round(predictedAmount),
            avgDaily: Math.round(avgDaily),
            monthlySubTotal: Math.round(monthlySubTotal),
            trend
        });

    } catch (error) {
        console.error("Error generating forecast:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
