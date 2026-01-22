import React, { useState, useEffect, useContext } from 'react';
import {
    Container, Grid, Card, Typography, Box, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, MenuItem, Fade, Grow
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import styles from '../../styles/home.module.css';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../../apiConfig';
import ReactMarkdown from 'react-markdown';

const BusinessDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openRevenueModal, setOpenRevenueModal] = useState(false);
    const [openExpenseModal, setOpenExpenseModal] = useState(false);
    const [businessAdvice, setBusinessAdvice] = useState('');
    const [loadingAdvice, setLoadingAdvice] = useState(false);
    const [revenueForm, setRevenueForm] = useState({
        amount: '',
        source: '',
        category: 'Sales',
        client: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });
    const [expenseForm, setExpenseForm] = useState({
        amount: '',
        category: '',
        expenseType: 'Operating',
        vendor: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });
    const [recentRevenue, setRecentRevenue] = useState([]);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [profitLoss, setProfitLoss] = useState(null);

    useEffect(() => {
        fetchMetrics();
    }, [user]);

    const fetchMetrics = async () => {
        try {
            if (!user?.id && !user?._id) return;
            const userId = user.id || user._id;

            // Fetch all data in parallel
            const [metricsRes, revenueRes, expensesRes, plRes] = await Promise.all([
                axios.get(`${API_URL}/business/metrics/${userId}`),
                axios.get(`${API_URL}/revenue/all/${userId}`),
                axios.get(`${API_URL}/business-expense/all/${userId}`),
                axios.get(`${API_URL}/business/profit-loss/${userId}`)
            ]);

            setMetrics(metricsRes.data);
            setRecentRevenue(revenueRes.data.slice(0, 5)); // Last 5
            setRecentExpenses(expensesRes.data.slice(0, 5)); // Last 5
            setProfitLoss(plRes.data);
        } catch (error) {
            console.error('Error fetching business data:', error);
            setMetrics({
                thisMonth: { revenue: 0, expenses: 0, profit: 0, profitMargin: 0 },
                growth: { revenue: 0, profit: 0 },
                topClients: []
            });
            setRecentRevenue([]);
            setRecentExpenses([]);
            setProfitLoss(null);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRevenue = async () => {
        try {
            const userId = user.id || user._id;
            await axios.post(`${API_URL}/revenue/add`, {
                userId,
                ...revenueForm,
                amount: parseFloat(revenueForm.amount)
            });
            setOpenRevenueModal(false);
            setRevenueForm({
                amount: '',
                source: '',
                category: 'Sales',
                client: '',
                date: new Date().toISOString().split('T')[0],
                description: ''
            });
            fetchMetrics();
            alert('Revenue added successfully! 💰');
        } catch (error) {
            console.error('Error adding revenue:', error);
            alert('Failed to add revenue');
        }
    };

    const handleAddExpense = async () => {
        try {
            const userId = user.id || user._id;
            await axios.post(`${API_URL}/business-expense/add`, {
                userId,
                ...expenseForm,
                amount: parseFloat(expenseForm.amount)
            });
            setOpenExpenseModal(false);
            setExpenseForm({
                amount: '',
                category: '',
                expenseType: 'Operating',
                vendor: '',
                date: new Date().toISOString().split('T')[0],
                description: ''
            });
            fetchMetrics();
            alert('Expense added successfully! 📊');
        } catch (error) {
            console.error('Error adding expense:', error);
            alert('Failed to add expense');
        }
    };

    if (loading) {
        return (
            <div className={styles.dbody} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '1rem' }}>
                <Box sx={{
                    width: 80,
                    height: 80,
                    border: '4px solid rgba(129, 140, 248, 0.2)',
                    borderTopColor: '#818cf8',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                    }
                }} />
                <Typography sx={{ color: '#fff', fontFamily: 'Poppins', fontSize: '1.2rem', fontWeight: 600 }}>
                    Loading Business Dashboard...
                </Typography>
            </div>
        );
    }

    const MetricCard = ({ title, value, subtitle, icon: Icon, gradient, delay }) => (
        <Grow in timeout={500 + delay}>
            <Card sx={{
                p: 3,
                background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px -10px ${gradient[0]}`,
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }
            }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>
                        {title}
                    </Typography>
                    <Icon sx={{ fontSize: '2rem', color: 'rgba(255,255,255,0.9)' }} />
                </Box>
                <Typography variant="h3" sx={{ fontFamily: 'Poppins', fontWeight: 900, color: '#ffffff', mb: 1 }}>
                    {value}
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                    {subtitle}
                </Typography>
            </Card>
        </Grow>
    );

    const revenueGrowth = parseFloat(metrics?.growth?.revenue || 0);
    const profitGrowth = parseFloat(metrics?.growth?.profit || 0);

    return (
        <div className={styles.dbody}>
            <Container maxWidth="lg" sx={{ pt: 12, pb: 8 }}>
                {/* Premium Header */}
                <Fade in timeout={300}>
                    <Box mb={6}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
                            <Box>
                                <Typography variant="h2" sx={{
                                    fontFamily: 'Poppins',
                                    fontWeight: 900,
                                    background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}>
                                    Business Dashboard
                                </Typography>
                                <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>
                                    Track revenue, profit, and growth metrics in real-time
                                </Typography>
                            </Box>
                            <Box display="flex" gap={2}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setOpenRevenueModal(true)}
                                    sx={{
                                        fontFamily: 'Poppins',
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        borderRadius: '16px',
                                        px: 3,
                                        py: 1.5,
                                        boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 15px 30px -5px rgba(16, 185, 129, 0.5)'
                                        }
                                    }}
                                >
                                    Add Revenue
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setOpenExpenseModal(true)}
                                    sx={{
                                        fontFamily: 'Poppins',
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        borderRadius: '16px',
                                        px: 3,
                                        py: 1.5,
                                        boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 15px 30px -5px rgba(239, 68, 68, 0.5)'
                                        }
                                    }}
                                >
                                    Add Expense
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>

                {/* Premium Metric Cards */}
                <Grid container spacing={3} mb={6}>
                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="REVENUE"
                            value={`₱${metrics?.thisMonth?.revenue?.toLocaleString() || '0'}`}
                            subtitle={
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    {revenueGrowth >= 0 ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                                    {Math.abs(revenueGrowth).toFixed(1)}% {revenueGrowth >= 0 ? 'increase' : 'decrease'}
                                </Box>
                            }
                            icon={AttachMoneyIcon}
                            gradient={['rgba(16, 185, 129, 0.3)', 'rgba(5, 150, 105, 0.3)']}
                            delay={0}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="EXPENSES"
                            value={`₱${metrics?.thisMonth?.expenses?.toLocaleString() || '0'}`}
                            subtitle="This month"
                            icon={TrendingUpIcon}
                            gradient={['rgba(239, 68, 68, 0.3)', 'rgba(220, 38, 38, 0.3)']}
                            delay={100}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="NET PROFIT"
                            value={`₱${metrics?.thisMonth?.profit?.toLocaleString() || '0'}`}
                            subtitle={`${metrics?.thisMonth?.profitMargin || '0'}% margin`}
                            icon={AccountBalanceIcon}
                            gradient={['rgba(99, 102, 241, 0.3)', 'rgba(139, 92, 246, 0.3)']}
                            delay={200}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <MetricCard
                            title="GROWTH"
                            value={`${profitGrowth >= 0 ? '+' : ''}${profitGrowth.toFixed(1)}%`}
                            subtitle={
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    {profitGrowth >= 0 ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                                    Profit growth
                                </Box>
                            }
                            icon={ShowChartIcon}
                            gradient={['rgba(245, 158, 11, 0.3)', 'rgba(217, 119, 6, 0.3)']}
                            delay={300}
                        />
                    </Grid>
                </Grid>

                {/* AI Business Intelligence */}
                <Grow in timeout={700}>
                    <Card sx={{
                        p: 4,
                        mb: 6,
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(129, 140, 248, 0.3)',
                        borderRadius: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
                            animation: loadingAdvice ? 'shimmer 2s infinite linear' : 'none',
                            backgroundSize: '200% 100%'
                        }} />
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                            <AutoGraphIcon sx={{ fontSize: '2.5rem', color: '#818cf8' }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#fff' }}>
                                    Wealth Intelligence: Business Edition
                                </Typography>
                                <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                    AI-powered strategic analysis for your business
                                </Typography>
                            </Box>
                        </Box>

                        {loadingAdvice ? (
                            <Box display="flex" alignItems="center" gap={2} py={4}>
                                <div className={styles.loadingSpinner} style={{ width: 24, height: 24, border: '3px solid rgba(129, 140, 248, 0.3)', borderTopColor: '#818cf8' }} />
                                <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.6)' }}>
                                    Analyzing market trajectory and profit margins...
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontFamily: 'Poppins',
                                '& h3': { color: '#818cf8', fontSize: '1.2rem', mt: 3, mb: 1.5, fontWeight: 600 },
                                '& p': { mb: 2, lineHeight: 1.7 },
                                '& ul': { pl: 2, mb: 2 },
                                '& li': { mb: 1, color: 'rgba(255,255,255,0.8)' },
                                '& strong': { color: '#fff', fontWeight: 600 }
                            }}>
                                <ReactMarkdown>{businessAdvice || "No enough data to generate analysis. Add revenue and expenses to unlock insights."}</ReactMarkdown>
                            </Box>
                        )}
                    </Card>
                </Grow>

                {/* P&L Summary + Top Clients Row */}
                <Grid container spacing={3} mb={6}>
                    {/* Profit & Loss Summary */}
                    <Grid item xs={12} md={6}>
                        <Grow in timeout={800}>
                            <Card sx={{
                                p: 3,
                                background: 'rgba(15, 23, 42, 0.7)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '24px',
                                height: '100%'
                            }}>
                                <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#fff', mb: 3 }}>
                                    📊 Profit & Loss Summary
                                </Typography>
                                {profitLoss ? (
                                    <Box>
                                        <Box display="flex" justifyContent="space-between" mb={2}>
                                            <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.7)' }}>Total Revenue</Typography>
                                            <Typography sx={{ fontFamily: 'Poppins', color: '#10b981', fontWeight: 600 }}>
                                                ₱{profitLoss.revenue?.total?.toLocaleString() || '0'}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={2}>
                                            <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.7)' }}>COGS</Typography>
                                            <Typography sx={{ fontFamily: 'Poppins', color: '#ef4444', fontWeight: 600 }}>
                                                -₱{profitLoss.expenses?.cogs?.toLocaleString() || '0'}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={2} pb={2} borderBottom="1px solid rgba(255,255,255,0.1)">
                                            <Typography sx={{ fontFamily: 'Poppins', color: '#fff', fontWeight: 600 }}>Gross Profit</Typography>
                                            <Typography sx={{ fontFamily: 'Poppins', color: '#10b981', fontWeight: 700 }}>
                                                ₱{profitLoss.profit?.gross?.toLocaleString() || '0'}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={2}>
                                            <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.7)' }}>Operating Expenses</Typography>
                                            <Typography sx={{ fontFamily: 'Poppins', color: '#ef4444', fontWeight: 600 }}>
                                                -₱{profitLoss.expenses?.operating?.toLocaleString() || '0'}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" pt={2} borderTop="2px solid rgba(99, 102, 241, 0.3)">
                                            <Typography sx={{ fontFamily: 'Poppins', color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Net Profit</Typography>
                                            <Typography sx={{ fontFamily: 'Poppins', color: '#6366f1', fontWeight: 900, fontSize: '1.2rem' }}>
                                                ₱{profitLoss.profit?.net?.toLocaleString() || '0'}
                                            </Typography>
                                        </Box>
                                        <Box mt={2} p={2} bgcolor="rgba(99, 102, 241, 0.1)" borderRadius="12px">
                                            <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                                                Net Margin: <span style={{ color: '#6366f1', fontWeight: 700 }}>{profitLoss.profit?.netMargin || '0'}%</span>
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 4 }}>
                                        No P&L data available
                                    </Typography>
                                )}
                            </Card>
                        </Grow>
                    </Grid>

                    {/* Top Clients */}
                    <Grid item xs={12} md={6}>
                        <Grow in timeout={900}>
                            <Card sx={{
                                p: 3,
                                background: 'rgba(15, 23, 42, 0.7)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '24px',
                                height: '100%'
                            }}>
                                <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#fff', mb: 3 }}>
                                    👥 Top Clients
                                </Typography>
                                {metrics?.topClients && metrics.topClients.length > 0 ? (
                                    <Box>
                                        {metrics.topClients.map((client, index) => (
                                            <Box key={client.id} display="flex" justifyContent="space-between" alignItems="center" mb={2} p={2}
                                                sx={{
                                                    background: 'rgba(99, 102, 241, 0.05)',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(99, 102, 241, 0.1)'
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Box sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        background: `linear-gradient(135deg, rgba(99, 102, 241, ${0.3 - index * 0.05}), rgba(139, 92, 246, ${0.3 - index * 0.05}))`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontFamily: 'Poppins',
                                                        fontWeight: 700,
                                                        color: '#fff'
                                                    }}>
                                                        #{index + 1}
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={{ fontFamily: 'Poppins', color: '#fff', fontWeight: 600 }}>
                                                            {client.name}
                                                        </Typography>
                                                        <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                                                            {client.company || 'No company'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Typography sx={{ fontFamily: 'Poppins', color: '#10b981', fontWeight: 700 }}>
                                                    ₱{client.totalRevenue?.toLocaleString() || '0'}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 4 }}>
                                        No clients yet. Add revenue with client names to track top clients.
                                    </Typography>
                                )}
                            </Card>
                        </Grow>
                    </Grid>
                </Grid>

                {/* Recent Transactions */}
                <Grow in timeout={1000}>
                    <Card sx={{
                        p: 3,
                        background: 'rgba(15, 23, 42, 0.7)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        mb: 6
                    }}>
                        <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#fff', mb: 3 }}>
                            📝 Recent Transactions
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography sx={{ fontFamily: 'Poppins', color: '#10b981', fontWeight: 600, mb: 2 }}>
                                    💰 Recent Revenue
                                </Typography>
                                {recentRevenue.length > 0 ? (
                                    recentRevenue.map(rev => (
                                        <Box key={rev.id} mb={2} p={2} sx={{
                                            background: 'rgba(16, 185, 129, 0.05)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(16, 185, 129, 0.1)'
                                        }}>
                                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                <Typography sx={{ fontFamily: 'Poppins', color: '#fff', fontWeight: 600 }}>
                                                    {rev.source}
                                                </Typography>
                                                <Typography sx={{ fontFamily: 'Poppins', color: '#10b981', fontWeight: 700 }}>
                                                    +₱{rev.amount?.toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                                                    {rev.category} {rev.client ? `• ${rev.client}` : ''}
                                                </Typography>
                                                <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                                                    {new Date(rev.date).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', py: 2 }}>
                                        No revenue entries yet
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography sx={{ fontFamily: 'Poppins', color: '#ef4444', fontWeight: 600, mb: 2 }}>
                                    📊 Recent Expenses
                                </Typography>
                                {recentExpenses.length > 0 ? (
                                    recentExpenses.map(exp => (
                                        <Box key={exp.id} mb={2} p={2} sx={{
                                            background: 'rgba(239, 68, 68, 0.05)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(239, 68, 68, 0.1)'
                                        }}>
                                            <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                <Typography sx={{ fontFamily: 'Poppins', color: '#fff', fontWeight: 600 }}>
                                                    {exp.category}
                                                </Typography>
                                                <Typography sx={{ fontFamily: 'Poppins', color: '#ef4444', fontWeight: 700 }}>
                                                    -₱{exp.amount?.toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                                                    {exp.expenseType} {exp.vendor ? `• ${exp.vendor}` : ''}
                                                </Typography>
                                                <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                                                    {new Date(exp.date).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', py: 2 }}>
                                        No expense entries yet
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Card>
                </Grow>

                {/* Add Revenue Modal */}
                <Dialog open={openRevenueModal} onClose={() => setOpenRevenueModal(false)} maxWidth="sm" fullWidth
                    PaperProps={{
                        sx: {
                            background: 'rgba(15, 23, 42, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '24px'
                        }
                    }}
                >
                    <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#fff' }}>💰 Add Revenue</DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2} mt={1}>
                            <TextField label="Amount (₱)" type="number" value={revenueForm.amount} onChange={(e) => setRevenueForm({ ...revenueForm, amount: e.target.value })} fullWidth required />
                            <TextField label="Source" value={revenueForm.source} onChange={(e) => setRevenueForm({ ...revenueForm, source: e.target.value })} fullWidth placeholder="e.g., Product Sales, Consulting" required />
                            <TextField label="Category" select value={revenueForm.category} onChange={(e) => setRevenueForm({ ...revenueForm, category: e.target.value })} fullWidth>
                                <MenuItem value="Sales">Sales</MenuItem>
                                <MenuItem value="Services">Services</MenuItem>
                                <MenuItem value="Consulting">Consulting</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                            <TextField label="Client (Optional)" value={revenueForm.client} onChange={(e) => setRevenueForm({ ...revenueForm, client: e.target.value })} fullWidth />
                            <TextField label="Date" type="date" value={revenueForm.date} onChange={(e) => setRevenueForm({ ...revenueForm, date: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
                            <TextField label="Description (Optional)" value={revenueForm.description} onChange={(e) => setRevenueForm({ ...revenueForm, description: e.target.value })} fullWidth multiline rows={2} />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpenRevenueModal(false)} sx={{ color: '#fff' }}>Cancel</Button>
                        <Button onClick={handleAddRevenue} variant="contained" disabled={!revenueForm.amount || !revenueForm.source}
                            sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                            Add Revenue
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Expense Modal */}
                <Dialog open={openExpenseModal} onClose={() => setOpenExpenseModal(false)} maxWidth="sm" fullWidth
                    PaperProps={{
                        sx: {
                            background: 'rgba(15, 23, 42, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '24px'
                        }
                    }}
                >
                    <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#fff' }}>📊 Add Business Expense</DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2} mt={1}>
                            <TextField label="Amount (₱)" type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} fullWidth required />
                            <TextField label="Category" value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} fullWidth placeholder="e.g., Marketing, Rent, Salaries" required />
                            <TextField label="Expense Type" select value={expenseForm.expenseType} onChange={(e) => setExpenseForm({ ...expenseForm, expenseType: e.target.value })} fullWidth>
                                <MenuItem value="COGS">COGS (Cost of Goods Sold)</MenuItem>
                                <MenuItem value="Operating">Operating Expense</MenuItem>
                                <MenuItem value="Capital">Capital Expenditure</MenuItem>
                            </TextField>
                            <TextField label="Vendor (Optional)" value={expenseForm.vendor} onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })} fullWidth />
                            <TextField label="Date" type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
                            <TextField label="Description (Optional)" value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} fullWidth multiline rows={2} />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpenExpenseModal(false)} sx={{ color: '#fff' }}>Cancel</Button>
                        <Button onClick={handleAddExpense} variant="contained" disabled={!expenseForm.amount || !expenseForm.category}
                            sx={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                            Add Expense
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
};

export default BusinessDashboard;
