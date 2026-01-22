import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Card, IconButton, Accordion,
    AccordionSummary, AccordionDetails
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CategoryIcon from '@mui/icons-material/Category';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SpeedIcon from '@mui/icons-material/Speed';
import styles from '../../styles/home.module.css';

const HowItWorks = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <AccountBalanceWalletIcon sx={{ fontSize: '2rem', color: '#818cf8' }} />,
            title: 'Available to Spend',
            description: 'Your spendable budget after deducting your savings target.',
            formula: 'Current Budget - Savings Target',
            example: 'If you have ₱50,000 budget and ₱10,000 savings target, you have ₱40,000 available to spend.'
        },
        {
            icon: <SavingsIcon sx={{ fontSize: '2rem', color: '#10b981' }} />,
            title: 'Savings Target',
            description: 'Money you set aside each budget period to build wealth. This amount is protected from spending.',
            formula: 'User-defined amount per budget cycle',
            example: 'Set ₱10,000 as savings target. This builds your wealth over time and is factored into the Neural Wealth Architecture.'
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: '2rem', color: '#f59e0b' }} />,
            title: 'Remaining',
            description: 'Your current budget balance after all expenses. Updates in real-time as you add expenses.',
            formula: 'Total Budget - Total Expenses',
            example: 'Started with ₱50,000, spent ₱11,000 → Remaining: ₱39,000'
        },
        {
            icon: <SpeedIcon sx={{ fontSize: '2rem', color: '#06b6d4' }} />,
            title: 'Smart Status',
            description: 'AI-powered indicator showing if you\'re on track with your budget based on time elapsed vs money spent.',
            formula: '(Spent% vs Time%) → On Track / Warning / Overspending',
            example: 'If 50% of time passed but you spent 60%, status shows "Slightly Ahead of Schedule" (caution).'
        },
        {
            icon: <AutoGraphIcon sx={{ fontSize: '2rem', color: '#8b5cf6' }} />,
            title: 'AI Prediction',
            description: 'Forecasts your total spending by end of budget period based on current daily average and subscriptions.',
            formula: '(Daily Avg × Days Remaining) + Future Subscriptions',
            example: 'Spending ₱500/day with 20 days left → Predicted: ₱10,000 more spending'
        },
        {
            icon: <CategoryIcon sx={{ fontSize: '2rem', color: '#ec4899' }} />,
            title: 'Category Breakdown',
            description: 'Visual analysis of where your money goes. Shows percentage and amount per category.',
            formula: '(Category Total / Total Spent) × 100',
            example: 'Food: ₱5,000 out of ₱10,000 total = 50% of spending'
        },
        {
            icon: <AutoGraphIcon sx={{ fontSize: '2rem', color: '#6366f1' }} />,
            title: 'Neural Wealth Architecture',
            description: '12-month wealth projection showing how your savings and spending habits build wealth over time.',
            formula: 'Net Worth = Current Balance + (Monthly Savings × 12) + (Savings Target × 12)',
            example: 'With ₱39,000 remaining, saving ₱5,000/month + ₱10,000 savings target → ₱219,000 in 12 months'
        },
        {
            icon: <SubscriptionsIcon sx={{ fontSize: '2rem', color: '#f43f5e' }} />,
            title: 'Subscriptions',
            description: 'Track recurring payments (Netflix, Spotify, etc.). Automatically factored into predictions and budget calculations.',
            formula: 'Monthly/Yearly recurring charges',
            example: 'Netflix ₱500/month appears in expenses automatically each month'
        },
        {
            icon: <ReceiptIcon sx={{ fontSize: '2rem', color: '#64748b' }} />,
            title: 'Recent Transactions',
            description: 'Real-time list of all your expenses and subscriptions. Search, filter, and delete as needed.',
            formula: 'Chronological list (newest first)',
            example: 'See all expenses from current budget period with amounts, categories, and dates'
        },
        {
            divider: true
        },
        {
            icon: <AttachMoneyIcon sx={{ fontSize: '2rem', color: '#10b981' }} />,
            title: 'Business Revenue & Expenses',
            description: 'Dedicated tracking for business income and operational costs. Separated from personal finance.',
            formula: 'Revenue - Expenses = Profit',
            example: 'Track client payments as "Revenue" and server costs as "Operating Expenses"'
        },
        {
            icon: <AutoGraphIcon sx={{ fontSize: '2rem', color: '#818cf8' }} />,
            title: 'Wealth Intelligence: Business',
            description: 'Separate AI advisor for your business. Analyzes margins, client value, and growth trajectory.',
            formula: 'AI Analysis of (Revenue, Expenses, Margins, Clients)',
            example: '"Your gross margin is 45%. To scale, focus on increasing Client X retention..."'
        },
        {
            icon: <TrendingUpIcon sx={{ fontSize: '2rem', color: '#f59e0b' }} />,
            title: 'Profit & Loss (P&L)',
            description: 'Automated P&L statement generation showing Gross and Net Profit in real-time.',
            formula: 'Gross Profit = Revenue - COGS; Net Profit = Gross - Operating Exp',
            example: 'See exactly how much you keep after paying for goods and operations'
        }
    ];

    return (
        <div className={styles.dbody} style={{ paddingBottom: '100px' }}>
            <Container maxWidth="lg" sx={{ pt: 12 }}>
                <Box display="flex" alignItems="center" mb={6} className={styles.fadeInUp}>
                    <IconButton
                        onClick={() => navigate('/home')}
                        sx={{
                            color: '#a5b4fc',
                            mr: 2,
                            '&:hover': { background: 'rgba(129, 140, 248, 0.1)' }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h3" sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 900,
                            color: '#ffffff',
                            letterSpacing: '-0.02em'
                        }}>
                            How It Works
                        </Typography>
                        <Typography variant="body1" sx={{
                            fontFamily: 'Poppins',
                            color: 'rgba(255,255,255,0.6)',
                            mt: 1
                        }}>
                            Understanding your financial intelligence dashboard
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {features.map((feature, index) => (
                        feature.divider ? (
                            <Box key={index} sx={{ my: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                                <Typography sx={{ fontFamily: 'Poppins', color: '#818cf8', fontWeight: 600, fontSize: '0.9rem' }}>
                                    BUSINESS DASHBOARD FEATURES
                                </Typography>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            </Box>
                        ) : (
                            <Accordion
                                key={index}
                                sx={{
                                    background: 'rgba(15, 23, 42, 0.7)',
                                    backdropFilter: 'blur(32px) saturate(180%)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    borderRadius: '24px !important',
                                    overflow: 'hidden',
                                    '&:before': { display: 'none' },
                                    mb: 0
                                }}
                                className={styles.fadeInUp}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: '#818cf8' }} />}
                                    sx={{
                                        padding: '20px 30px',
                                        '&:hover': { background: 'rgba(255,255,255,0.02)' }
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2}>
                                        {feature.icon}
                                        <Box>
                                            <Typography sx={{
                                                fontFamily: 'Poppins',
                                                fontWeight: 700,
                                                color: '#ffffff',
                                                fontSize: '1.1rem'
                                            }}>
                                                {feature.title}
                                            </Typography>
                                            <Typography sx={{
                                                fontFamily: 'Poppins',
                                                color: 'rgba(255,255,255,0.6)',
                                                fontSize: '0.9rem'
                                            }}>
                                                {feature.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ padding: '0 30px 30px 30px' }}>
                                    <Box sx={{
                                        background: 'rgba(255,255,255,0.03)',
                                        padding: '20px',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <Typography sx={{
                                            fontFamily: 'Poppins',
                                            color: '#818cf8',
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                            mb: 1
                                        }}>
                                            📐 Formula
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: 'monospace',
                                            color: '#10b981',
                                            fontSize: '0.9rem',
                                            mb: 2,
                                            padding: '10px',
                                            background: 'rgba(16,185,129,0.05)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(16,185,129,0.1)'
                                        }}>
                                            {feature.formula}
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: 'Poppins',
                                            color: '#f59e0b',
                                            fontWeight: 600,
                                            fontSize: '0.85rem',
                                            mb: 1
                                        }}>
                                            💡 Example
                                        </Typography>
                                        <Typography sx={{
                                            fontFamily: 'Poppins',
                                            color: 'rgba(255,255,255,0.7)',
                                            fontSize: '0.9rem',
                                            lineHeight: 1.6
                                        }}>
                                            {feature.example}
                                        </Typography>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        )
                    ))}
                </Box>

                <Card sx={{
                    mt: 6,
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    border: '1px solid rgba(129, 140, 248, 0.2)',
                    padding: '40px',
                    textAlign: 'center'
                }} className={styles.fadeInUp}>
                    <Typography variant="h5" sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                        color: '#ffffff',
                        mb: 2
                    }}>
                        🚀 Pro Tip
                    </Typography>
                    <Typography sx={{
                        fontFamily: 'Poppins',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '1rem',
                        lineHeight: 1.8,
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Set a realistic savings target (10-30% of budget) and let the Neural Wealth Architecture
                        show you how your wealth grows over time. The AI learns from your spending patterns
                        to give you increasingly accurate predictions!
                    </Typography>
                </Card>
            </Container>
        </div>
    );
};

export default HowItWorks;
