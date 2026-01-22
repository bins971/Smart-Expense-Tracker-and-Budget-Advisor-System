import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogContent, Box, Typography, Button, Grid, Card,
    CircularProgress, IconButton, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { API_URL } from '../../apiConfig';

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetSummaryReport = ({ open, onClose, userId }) => {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (open && userId) {
            fetchSummary();
        }
    }, [open, userId]);

    const fetchSummary = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/summary/${userId}`);
            setSummary(res.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNewBudget = () => {
        onClose();
        navigate('/setBudget');
    };

    if (!summary && !loading) return null;

    const chartData = summary ? {
        labels: Object.keys(summary.spending.categoryBreakdown),
        datasets: [{
            data: Object.values(summary.spending.categoryBreakdown),
            backgroundColor: [
                '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
                '#10b981', '#3b82f6', '#ef4444', '#64748b'
            ],
            borderWidth: 0
        }]
    } : null;

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#ffffff',
                    font: { family: 'Poppins', size: 12 },
                    padding: 15
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleFont: { family: 'Poppins', size: 14 },
                bodyFont: { family: 'Poppins', size: 13 },
                padding: 12,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1
            }
        },
        maintainAspectRatio: true
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen
            PaperProps={{
                style: {
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    overflow: 'auto'
                }
            }}
        >
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 20,
                    top: 20,
                    color: 'rgba(255,255,255,0.7)',
                    zIndex: 1000,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent sx={{ p: { xs: 2, md: 6 } }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                        <CircularProgress sx={{ color: '#818cf8' }} size={60} />
                    </Box>
                ) : (
                    <Box maxWidth="1200px" margin="0 auto">
                        {/* Header */}
                        <Box textAlign="center" mb={6}>
                            <Typography variant="h2" sx={{
                                fontFamily: 'Poppins',
                                fontWeight: 900,
                                color: '#ffffff',
                                mb: 2,
                                fontSize: { xs: '2rem', md: '3rem' }
                            }}>
                                Budget Period Complete! 🎉
                            </Typography>
                            <Typography sx={{
                                fontFamily: 'Poppins',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '1.1rem'
                            }}>
                                {new Date(summary.period.start).toLocaleDateString()} - {new Date(summary.period.end).toLocaleDateString()}
                            </Typography>
                        </Box>

                        {/* Achievement Badge */}
                        <Box textAlign="center" mb={6}>
                            <Box sx={{
                                display: 'inline-block',
                                padding: '30px 50px',
                                borderRadius: '24px',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                                border: '2px solid rgba(129, 140, 248, 0.3)',
                                animation: 'pulse 2s infinite'
                            }}>
                                <Typography variant="h3" sx={{
                                    fontFamily: 'Poppins',
                                    fontWeight: 800,
                                    color: '#ffffff',
                                    mb: 1
                                }}>
                                    {summary.achievement}
                                </Typography>
                                <Typography sx={{
                                    fontFamily: 'Poppins',
                                    color: '#10b981',
                                    fontSize: '1.2rem',
                                    fontWeight: 600
                                }}>
                                    Saved {summary.spending.savingsPercent}% of your budget!
                                </Typography>
                            </Box>
                        </Box>

                        {/* Spending Summary */}
                        <Grid container spacing={3} mb={6}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{
                                    p: 3,
                                    background: 'rgba(15, 23, 42, 0.7)',
                                    backdropFilter: 'blur(32px)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    borderRadius: '24px'
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontFamily: 'Poppins',
                                        color: 'rgba(255,255,255,0.6)',
                                        mb: 3,
                                        textTransform: 'uppercase',
                                        fontSize: '0.85rem',
                                        letterSpacing: '1px'
                                    }}>
                                        Financial Summary
                                    </Typography>
                                    <Box display="flex" flexDirection="column" gap={2}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.8)' }}>
                                                Total Budget
                                            </Typography>
                                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#ffffff', fontSize: '1.2rem' }}>
                                                ₱{summary.period.totalBudget.toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.8)' }}>
                                                Total Spent
                                            </Typography>
                                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#ef4444', fontSize: '1.2rem' }}>
                                                ₱{summary.spending.total.toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.8)' }}>
                                                Savings Achieved
                                            </Typography>
                                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#10b981', fontSize: '1.2rem' }}>
                                                ₱{summary.spending.savingsAchieved.toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.8)' }}>
                                                Expenses Tracked
                                            </Typography>
                                            <Chip
                                                label={summary.expenseCount}
                                                sx={{
                                                    bgcolor: 'rgba(99, 102, 241, 0.2)',
                                                    color: '#818cf8',
                                                    fontFamily: 'Poppins',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{
                                    p: 3,
                                    background: 'rgba(15, 23, 42, 0.7)',
                                    backdropFilter: 'blur(32px)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    borderRadius: '24px',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}>
                                    <Typography variant="h6" sx={{
                                        fontFamily: 'Poppins',
                                        color: 'rgba(255,255,255,0.6)',
                                        mb: 3,
                                        textTransform: 'uppercase',
                                        fontSize: '0.85rem',
                                        letterSpacing: '1px',
                                        textAlign: 'center'
                                    }}>
                                        Category Breakdown
                                    </Typography>
                                    {chartData && <Doughnut data={chartData} options={chartOptions} />}
                                </Card>
                            </Grid>
                        </Grid>

                        {/* AI Advice */}
                        {summary.aiAdvice && (
                            <Card sx={{
                                p: 4,
                                mb: 6,
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                                border: '1px solid rgba(129, 140, 248, 0.2)',
                                borderRadius: '24px'
                            }}>
                                <Typography variant="h5" sx={{
                                    fontFamily: 'Poppins',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    💡 AI Financial Advisor
                                </Typography>
                                <Box sx={{
                                    '& h2': {
                                        fontFamily: 'Poppins',
                                        color: '#818cf8',
                                        fontSize: '1.3rem',
                                        fontWeight: 700,
                                        mt: 3,
                                        mb: 2
                                    },
                                    '& p': {
                                        fontFamily: 'Poppins',
                                        color: 'rgba(255,255,255,0.8)',
                                        lineHeight: 1.8,
                                        mb: 2
                                    },
                                    '& strong': {
                                        color: '#ffffff',
                                        fontWeight: 600
                                    },
                                    '& ul, & ol': {
                                        fontFamily: 'Poppins',
                                        color: 'rgba(255,255,255,0.8)',
                                        lineHeight: 1.8
                                    }
                                }}>
                                    <ReactMarkdown>{summary.aiAdvice}</ReactMarkdown>
                                </Box>
                            </Card>
                        )}

                        {/* CTA Buttons */}
                        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleCreateNewBudget}
                                sx={{
                                    fontFamily: 'Poppins',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    padding: '14px 40px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    textTransform: 'none',
                                    boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 15px 30px -5px rgba(99, 102, 241, 0.5)'
                                    }
                                }}
                            >
                                Create New Budget
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => {
                                    onClose();
                                    navigate('/budget-history');
                                }}
                                sx={{
                                    fontFamily: 'Poppins',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    padding: '14px 40px',
                                    borderRadius: '16px',
                                    borderColor: 'rgba(255,255,255,0.2)',
                                    color: '#ffffff',
                                    textTransform: 'none',
                                    '&:hover': {
                                        borderColor: 'rgba(255,255,255,0.4)',
                                        background: 'rgba(255,255,255,0.05)'
                                    }
                                }}
                            >
                                View Full History
                            </Button>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `}</style>
        </Dialog>
    );
};

export default BudgetSummaryReport;
