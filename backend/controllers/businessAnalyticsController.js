const prisma = require('../lib/db');

// Get Profit & Loss Statement
exports.getProfitLoss = async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const end = endDate ? new Date(endDate) : new Date();

        // Get all revenue
        const revenues = await prisma.revenue.findMany({
            where: {
                userId,
                date: { gte: start, lte: end }
            }
        });

        // Get all business expenses
        const expenses = await prisma.businessExpense.findMany({
            where: {
                userId,
                date: { gte: start, lte: end }
            }
        });

        // Calculate totals
        const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);

        // Separate COGS and Operating Expenses
        const cogs = expenses
            .filter(e => e.expenseType === 'COGS')
            .reduce((sum, e) => sum + e.amount, 0);

        const operatingExpenses = expenses
            .filter(e => e.expenseType === 'Operating')
            .reduce((sum, e) => sum + e.amount, 0);

        // Calculate profits
        const grossProfit = totalRevenue - cogs;
        const netProfit = grossProfit - operatingExpenses;
        const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
        const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

        // Revenue breakdown by category
        const revenueByCategory = {};
        revenues.forEach(r => {
            revenueByCategory[r.category] = (revenueByCategory[r.category] || 0) + r.amount;
        });

        // Expense breakdown by category
        const expenseByCategory = {};
        expenses.forEach(e => {
            expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
        });

        res.json({
            period: { start, end },
            revenue: {
                total: totalRevenue,
                byCategory: revenueByCategory
            },
            expenses: {
                cogs,
                operating: operatingExpenses,
                total: cogs + operatingExpenses,
                byCategory: expenseByCategory
            },
            profit: {
                gross: grossProfit,
                net: netProfit,
                grossMargin: grossMargin.toFixed(2),
                netMargin: netMargin.toFixed(2)
            }
        });

    } catch (error) {
        console.error('Error generating P&L:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get ROI by Projects
exports.getROI = async (req, res) => {
    try {
        const { userId } = req.params;

        const projects = await prisma.project.findMany({
            where: { userId }
        });

        const projectROI = projects.map(project => {
            const roi = project.investment > 0
                ? ((project.revenue - project.investment) / project.investment) * 100
                : 0;

            const profit = project.revenue - project.expenses;
            const profitMargin = project.revenue > 0 ? (profit / project.revenue) * 100 : 0;

            return {
                id: project.id,
                name: project.name,
                client: project.client,
                status: project.status,
                investment: project.investment,
                revenue: project.revenue,
                expenses: project.expenses,
                profit,
                roi: roi.toFixed(2),
                profitMargin: profitMargin.toFixed(2),
                startDate: project.startDate,
                endDate: project.endDate
            };
        });

        // Calculate overall ROI
        const totalInvestment = projects.reduce((sum, p) => sum + p.investment, 0);
        const totalRevenue = projects.reduce((sum, p) => sum + p.revenue, 0);
        const overallROI = totalInvestment > 0
            ? ((totalRevenue - totalInvestment) / totalInvestment) * 100
            : 0;

        res.json({
            projects: projectROI,
            overall: {
                totalInvestment,
                totalRevenue,
                roi: overallROI.toFixed(2)
            }
        });

    } catch (error) {
        console.error('Error calculating ROI:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Cash Flow Analysis
exports.getCashFlow = async (req, res) => {
    try {
        const { userId } = req.params;
        const { months = 6 } = req.query;

        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - parseInt(months));

        // Get revenue and expenses for the period
        const [revenues, expenses] = await Promise.all([
            prisma.revenue.findMany({
                where: {
                    userId,
                    date: { gte: monthsAgo }
                },
                orderBy: { date: 'asc' }
            }),
            prisma.businessExpense.findMany({
                where: {
                    userId,
                    date: { gte: monthsAgo }
                },
                orderBy: { date: 'asc' }
            })
        ]);

        // Group by month
        const cashFlowByMonth = {};

        revenues.forEach(r => {
            const monthKey = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}`;
            if (!cashFlowByMonth[monthKey]) {
                cashFlowByMonth[monthKey] = { inflow: 0, outflow: 0 };
            }
            cashFlowByMonth[monthKey].inflow += r.amount;
        });

        expenses.forEach(e => {
            const monthKey = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, '0')}`;
            if (!cashFlowByMonth[monthKey]) {
                cashFlowByMonth[monthKey] = { inflow: 0, outflow: 0 };
            }
            cashFlowByMonth[monthKey].outflow += e.amount;
        });

        // Calculate net cash flow and running balance
        let runningBalance = 0;
        const cashFlowData = Object.keys(cashFlowByMonth)
            .sort()
            .map(month => {
                const { inflow, outflow } = cashFlowByMonth[month];
                const netCashFlow = inflow - outflow;
                runningBalance += netCashFlow;

                return {
                    month,
                    inflow,
                    outflow,
                    netCashFlow,
                    runningBalance
                };
            });

        // Calculate burn rate (average monthly outflow)
        const totalOutflow = Object.values(cashFlowByMonth).reduce((sum, m) => sum + m.outflow, 0);
        const avgMonthlyBurn = totalOutflow / Object.keys(cashFlowByMonth).length;

        // Calculate runway (months of cash remaining)
        const currentCash = runningBalance;
        const runway = avgMonthlyBurn > 0 ? currentCash / avgMonthlyBurn : 0;

        res.json({
            cashFlow: cashFlowData,
            metrics: {
                currentCash: runningBalance,
                avgMonthlyBurn: avgMonthlyBurn.toFixed(2),
                runway: runway.toFixed(1)
            }
        });

    } catch (error) {
        console.error('Error calculating cash flow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Business Metrics Dashboard
exports.getMetrics = async (req, res) => {
    try {
        const { userId } = req.params;

        const today = new Date();
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

        // This month data
        const [thisMonthRevenue, thisMonthExpenses] = await Promise.all([
            prisma.revenue.findMany({
                where: { userId, date: { gte: thisMonthStart } }
            }),
            prisma.businessExpense.findMany({
                where: { userId, date: { gte: thisMonthStart } }
            })
        ]);

        // Last month data
        const [lastMonthRevenue, lastMonthExpenses] = await Promise.all([
            prisma.revenue.findMany({
                where: { userId, date: { gte: lastMonthStart, lte: lastMonthEnd } }
            }),
            prisma.businessExpense.findMany({
                where: { userId, date: { gte: lastMonthStart, lte: lastMonthEnd } }
            })
        ]);

        const thisMonthRev = thisMonthRevenue.reduce((sum, r) => sum + r.amount, 0);
        const thisMonthExp = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
        const thisMonthProfit = thisMonthRev - thisMonthExp;

        const lastMonthRev = lastMonthRevenue.reduce((sum, r) => sum + r.amount, 0);
        const lastMonthExp = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
        const lastMonthProfit = lastMonthRev - lastMonthExp;

        // Calculate growth
        const revenueGrowth = lastMonthRev > 0 ? ((thisMonthRev - lastMonthRev) / lastMonthRev) * 100 : 0;
        const profitGrowth = lastMonthProfit > 0 ? ((thisMonthProfit - lastMonthProfit) / lastMonthProfit) * 100 : 0;

        // Get top clients
        const clients = await prisma.client.findMany({
            where: { userId },
            orderBy: { totalRevenue: 'desc' },
            take: 5
        });

        res.json({
            thisMonth: {
                revenue: thisMonthRev,
                expenses: thisMonthExp,
                profit: thisMonthProfit,
                profitMargin: thisMonthRev > 0 ? ((thisMonthProfit / thisMonthRev) * 100).toFixed(2) : 0
            },
            growth: {
                revenue: revenueGrowth.toFixed(2),
                profit: profitGrowth.toFixed(2)
            },
            topClients: clients
        });

    } catch (error) {
        console.error('Error fetching business metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = exports;
