
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Card, Typography, Box, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Fab, LinearProgress, IconButton, Tooltip as MuiTooltip, CircularProgress
} from '@mui/material';
import Subscriptions from './Subscriptions';
import ForecastWidget from './ForecastWidget';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement, Filler } from 'chart.js';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import styles from '../../styles/home.module.css';
import axios from 'axios';
import { API_URL } from "../../apiConfig";
import { AuthContext } from '../../context/AuthContext';
import AddGoalModal from './AddGoalModal';
import BudgetSummaryReport from './BudgetSummaryReport';

ChartJS.register(ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement, Filler);

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(null);
  const [spendableBudget, setSpendableBudget] = useState(null);
  const [savingsTarget, setSavingsTarget] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(null);
  const [startdate, setstartdate] = useState(null);
  const [enddate, setenddate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [categoryPercentages, setCategoryPercentages] = useState([]);
  const [dailyExpenses, setDailyExpenses] = useState([]);

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [smartProgress, setSmartProgress] = useState({ value: 0, color: 'primary', message: '', icon: null });
  const [wealthArchitecture, setWealthArchitecture] = useState([]);
  const [savingsVelocity, setSavingsVelocity] = useState(0);
  const [anomalyAlert, setAnomalyAlert] = useState(null);

  const [goals, setGoals] = useState([]);
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [budgetExpired, setBudgetExpired] = useState(false);
  const [showSummaryReport, setShowSummaryReport] = useState(false);

  const getDisplayName = () => {
    if (user?.username) return user.username;
    if (user?.email) {
      const name = user.email.split("@")[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return "Friend";
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || (!user.id && !user._id)) return;
        const userId = user.id || user._id;
        const userEmail = user?.email;

        const [budgetRes, categoryRes, dailyRes, transactionsRes, forecastRes, goalsRes] = await Promise.allSettled([
          axios.get(`${API_URL}/budget/fetch/${userId}`),
          axios.get(`${API_URL}/expense/category-percentage/${userId}`),
          axios.get(`${API_URL}/expense/daily-expenses/${userId}`),
          axios.get(`${API_URL}/expense/all/${userId}`),
          axios.get(`${API_URL}/advisor/forecast/${userId}`),
          userEmail ? axios.get(`${API_URL}/goal/email/${userEmail}`) : Promise.resolve({ data: [] })
        ]);

        // Process Budget
        if (budgetRes.status === 'fulfilled') {
          const bData = budgetRes.value.data;
          setTotalAmount(bData.totalAmount);
          setSavingsTarget(bData.savingsTarget || 0);
          setSpendableBudget(bData.spendableBudget || bData.totalAmount);
          setCurrentAmount(bData.currentAmount);
          if (bData.startdate) setstartdate(new Date(bData.startdate).toISOString().split('T')[0]);
          if (bData.enddate) setenddate(new Date(bData.enddate).toISOString().split('T')[0]);

          // Check if budget period has ended
          const today = new Date();
          const endDate = new Date(bData.enddate);
          if (today > endDate) {
            setBudgetExpired(true);
            setShowSummaryReport(true);
          }
        } else {
          console.log("No budget found or error fetching budget");
          setTotalAmount(0); setSavingsTarget(0); setSpendableBudget(0); setCurrentAmount(0);
        }

        // Process Categories
        if (categoryRes.status === 'fulfilled') {
          setCategoryPercentages(categoryRes.value.data?.categoryPercentages || []);
        }

        // Process Daily Expenses
        if (dailyRes.status === 'fulfilled') {
          setDailyExpenses(dailyRes.value.data?.dailyExpenses || []);
        }

        // Process Transactions
        if (transactionsRes.status === 'fulfilled') {
          const expenses = transactionsRes.value.data?.expenses || [];
          const sorted = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
          setRecentTransactions(sorted);
        }

        // Process Forecast
        if (forecastRes.status === 'fulfilled') {
          const fData = forecastRes.value.data;
          if (fData && fData.trend) {
            let statusColor = '#10b981';
            if (fData.trend === 'up') statusColor = '#f43f5e';
            if (fData.trend === 'caution') statusColor = '#f59e0b';

            setSmartProgress({
              value: isNaN(parseFloat(fData.burnRate)) ? 0 : parseFloat(fData.burnRate),
              color: statusColor,
              message: fData.statusMessage || "Calculating...",
              timeValue: isNaN(parseFloat(fData.timePercent)) ? 0 : parseFloat(fData.timePercent)
            });
            setAnomalyAlert(fData.anomalyAlert);
            setWealthArchitecture(fData.projection || []);
            setSavingsVelocity(fData.savingsVelocity || 0);
          }
        }

        // Process Goals
        if (goalsRes.status === 'fulfilled') {
          setGoals(Array.isArray(goalsRes.value.data) ? goalsRes.value.data : []);
        }

      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);






  const chartCardStyle = {
    padding: '24px',
    borderRadius: '32px',
    background: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(32px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
    height: '100%',
    transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
    color: '#ffffff',
    '&:hover': {
      transform: 'translateY(-10px) scale(1.02)',
      background: 'rgba(30, 41, 59, 0.8)',
      borderColor: 'rgba(99, 102, 241, 0.6)',
      boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.8)'
    }
  };

  return (
    <>
      <div className={styles.dbody}>
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="body2" sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.05em' }}>
              {startdate} — {enddate}
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} className={styles.greetingAnim}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={6} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', pb: 4 }}>
                  <Box>
                    <Typography variant="h3" fontWeight="900" sx={{
                      fontFamily: 'Poppins',
                      background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 50%, #818cf8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                      letterSpacing: '-0.04em',
                      filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))'
                    }}>
                      Welcome back, {getDisplayName()}
                    </Typography>
                  </Box>

                  <Button
                    startIcon={<HistoryIcon />}
                    onClick={() => navigate('/budget-history')}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontFamily: 'Poppins',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      px: 3,
                      py: 1,
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }
                    }}
                  >
                    History
                  </Button>
                </Box>

                <Grid container spacing={4} mb={6}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{
                      ...chartCardStyle,
                      p: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: '0 20px 50px -12px rgba(0,0,0,0.5)'
                    }}>
                      <Box>
                        <Typography variant="h5" fontWeight="800" sx={{ color: '#F8FAFC', fontFamily: 'Poppins' }}>Set Financial Budget</Typography>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => navigate('/setBudget')}
                        sx={{
                          bgcolor: '#4338CA',
                          borderRadius: '14px',
                          px: 4,
                          py: 1.5,
                          fontWeight: 700,
                          textTransform: 'none',
                          '&:hover': { bgcolor: '#3730A3', transform: 'translateY(-2px)' },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Plan Now
                      </Button>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{
                      ...chartCardStyle,
                      p: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: '0 20px 50px -12px rgba(0,0,0,0.5)'
                    }}>
                      <Box>
                        <Typography variant="h5" fontWeight="800" sx={{ color: '#F8FAFC', fontFamily: 'Poppins' }}>Analytic History</Typography>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => navigate('/budget-history')}
                        sx={{
                          bgcolor: '#F43F5E',
                          borderRadius: '14px',
                          px: 4,
                          py: 1.5,
                          fontWeight: 700,
                          textTransform: 'none',
                          '&:hover': { bgcolor: '#E11D48', transform: 'translateY(-2px)' },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Explore
                      </Button>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={savingsTarget > 0 ? 3 : 4} className={`${styles.fadeInUp} ${styles.delay1}`}>
                <Card sx={{
                  ...chartCardStyle,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)'
                }} className={styles.glassCard}>
                  <CardContent sx={{ p: '24px !important' }}>
                    <Typography variant="subtitle2" sx={{ opacity: 0.9, fontFamily: 'Poppins', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Available to Spend</Typography>
                    <Typography variant="h3" fontWeight="900" sx={{ fontFamily: 'Poppins', my: 1, letterSpacing: '-0.02em' }}>₱{spendableBudget?.toLocaleString()}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500 }}>Period: {startdate} - {enddate}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              {savingsTarget > 0 && (
                <Grid item xs={12} md={3} className={`${styles.fadeInUp} ${styles.delay1}`}>
                  <Card sx={{
                    ...chartCardStyle,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)'
                  }} className={styles.glassCard}>
                    <CardContent sx={{ p: '24px !important' }}>
                      <Typography variant="subtitle2" sx={{ opacity: 0.9, fontFamily: 'Poppins', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>💰 Savings Target</Typography>
                      <Typography variant="h3" fontWeight="900" sx={{ fontFamily: 'Poppins', my: 1, letterSpacing: '-0.02em' }}>₱{savingsTarget?.toLocaleString()}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500 }}>Set aside from ₱{totalAmount?.toLocaleString()}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              <Grid item xs={12} md={savingsTarget > 0 ? 3 : 4} className={`${styles.fadeInUp} ${styles.delay2}`}>
                <Card sx={chartCardStyle} className={styles.glassCard}>
                  <CardContent sx={{ p: '24px !important' }}>
                    <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontFamily: 'Poppins', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Remaining</Typography>
                    <Typography variant="h3" fontWeight="900" sx={{ color: '#ffffff', fontFamily: 'Poppins', my: 1, letterSpacing: '-0.02em' }}>₱{currentAmount?.toLocaleString()}</Typography>
                    <LinearProgress variant="determinate" value={spendableBudget > 0 ? ((currentAmount / spendableBudget) * 100) : 0} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #6366f1, #a855f7)' } }} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={savingsTarget > 0 ? 3 : 4} className={`${styles.fadeInUp} ${styles.delay3}`}>
                <Card sx={chartCardStyle} className={styles.glassCard}>
                  <CardContent sx={{ p: '24px !important' }}>
                    <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontFamily: 'Poppins', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Smart Status</Typography>
                    <Box display="flex" alignItems="center" my={1} sx={{ minHeight: '60px' }}>
                      <Typography variant="h5" fontWeight="900" sx={{ fontFamily: 'Poppins', letterSpacing: '-0.01em', color: smartProgress.color, lineHeight: 1.2 }}>
                        {anomalyAlert ? "ANOMALY DETECTED" : smartProgress.message}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: anomalyAlert ? '#f43f5e' : '#64748b', fontWeight: 600 }}>
                      {anomalyAlert || `Spent ${spendableBudget > 0 ? Math.round(100 - (currentAmount / spendableBudget * 100)) : 0}% in ${isNaN(smartProgress.timeValue) ? 0 : Math.round(smartProgress.timeValue)}% of time`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4} className={`${styles.fadeInUp} ${styles.delay1}`}>
                <ForecastWidget />
              </Grid>

              <Grid item xs={12} md={4} className={`${styles.fadeInUp} ${styles.delay2}`}>
                <Card sx={chartCardStyle} className={styles.glassCard}>
                  <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Poppins', mb: 3 }}>Category Breakdown</Typography>
                  <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {categoryPercentages.length > 0 ? (
                      categoryPercentages.map((item, index) => (
                        <Box key={index} mb={2}>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" fontWeight="700" sx={{ fontFamily: 'Poppins', color: '#f8fafc' }}>{item.category}</Typography>
                            <Typography variant="caption" fontWeight="800" sx={{ color: '#818cf8', bgcolor: 'rgba(129, 140, 248, 0.1)', px: 1, borderRadius: '4px' }}>{Number(item.percentage).toFixed(1)}%</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Number(item.percentage)}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              bgcolor: 'rgba(255, 255, 255, 0.05)',
                              '& .MuiLinearProgress-bar': {
                                background: [
                                  'linear-gradient(90deg, #6366f1, #818cf8)',
                                  'linear-gradient(90deg, #10b981, #34d399)',
                                  'linear-gradient(90deg, #f43f5e, #fb7185)',
                                  'linear-gradient(90deg, #f59e0b, #fbbf24)',
                                  'linear-gradient(90deg, #3b82f6, #60a5fa)',
                                  'linear-gradient(90deg, #8b5cf6, #a78bfa)'
                                ][index % 6],
                                borderRadius: 5
                              }
                            }}
                          />
                        </Box>
                      ))
                    ) : (
                      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography variant="body2" sx={{ color: '#64748b' }}>No data available</Typography>
                      </Box>
                    )}
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={4} className={`${styles.fadeInUp} ${styles.delay3}`}>
                <Subscriptions />
              </Grid>


              <Grid item xs={12} md={7} className={`${styles.fadeInUp} ${styles.delay5}`}>
                <Card sx={chartCardStyle} className={styles.glassCard}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Poppins' }}>Neural Wealth Architecture</Typography>
                    <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 800 }}>12-MONTH PROJECTION</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 2 }}>
                    {wealthArchitecture.length > 0 ? wealthArchitecture.map((p, idx) => (
                      <Box key={idx} sx={{
                        minWidth: '80px',
                        p: 2,
                        borderRadius: '16px',
                        bgcolor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(129, 140, 248, 0.1)',
                        textAlign: 'center'
                      }}>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>{p.month}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#ffffff' }}>₱{p.netWorth?.toLocaleString() || '0'}</Typography>
                      </Box>
                    )) : (
                      <Box sx={{ py: 4, textAlign: 'center', width: '100%', opacity: 0.5 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'Poppins', fontStyle: 'italic' }}>
                          Projections will appear once your budget and spending patterns are established.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ color: '#475569', mt: 2, display: 'block', fontStyle: 'italic' }}>
                    {savingsVelocity > 0
                      ? `* Projections based on current monthly savings pace of ₱${savingsVelocity.toLocaleString()}.`
                      : `* Projections based on current spending velocity and balance.`}
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} md={5} className={`${styles.fadeInUp} ${styles.delay4}`} id="recent-transactions">
                <Card sx={{ ...chartCardStyle, p: 0 }} className={styles.glassCard}>
                  <Box p={3} display="flex" justifyContent="space-between" alignItems="center" bgcolor="transparent">
                    <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Poppins', color: '#f8fafc' }}>Recent Transactions</Typography>
                  </Box>

                  <Box px={3} pb={2}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        sx: {
                          borderRadius: '16px',
                          bgcolor: 'rgba(255,255,255,0.03)',
                          color: '#ffffff',
                          border: '1px solid rgba(255,255,255,0.1)',
                          '&:hover': { borderColor: 'rgba(255,255,255,0.2)' },
                          '&.Mui-focused': { borderColor: '#6366f1' }
                        }
                      }}
                    />
                  </Box>

                  <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 300, bgcolor: 'transparent' }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.75rem', bgcolor: 'transparent', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Name</TableCell>
                          <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.75rem', bgcolor: 'transparent', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Amount</TableCell>
                          <TableCell align="right" sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.75rem', bgcolor: 'transparent', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentTransactions
                          .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .slice(0, 6)
                          .map((row) => (
                            <TableRow key={row.id || row._id} sx={{
                              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                              transition: 'all 0.2s',
                              borderLeft: row.isSubscription ? '4px solid #10B981' : 'none',
                              borderColor: 'rgba(255,255,255,0.05)'
                            }}>
                              <TableCell sx={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <Box display="flex" flexDirection="column">
                                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc' }}>{row.name}</Typography>
                                  {row.isSubscription && (
                                    <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                                      Subscription
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '0.9rem', color: row.isSubscription ? '#10b981' : '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                ₱{row.amount.toLocaleString()}
                              </TableCell>
                              <TableCell align="right" sx={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                {row.isSubscription ? (
                                  <MuiTooltip title="Subscriptions are managed in the billing section">
                                    <span>
                                      <IconButton size="small" disabled sx={{ color: '#9CA3AF' }}>
                                        <HistoryIcon fontSize="inherit" />
                                      </IconButton>
                                    </span>
                                  </MuiTooltip>
                                ) : (
                                  <IconButton size="small" sx={{ color: '#EF4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }} onClick={async () => {
                                    if (window.confirm('Are you sure you want to delete this expense?')) {
                                      try {
                                        await axios.delete(`${API_URL}/expense/delete/${row.id || row._id}`);

                                        // Refresh data instead of full page reload
                                        const userId = user.id || user._id;
                                        const [budgetRes, categoryRes, transactionsRes] = await Promise.allSettled([
                                          axios.get(`${API_URL}/budget/fetch/${userId}`),
                                          axios.get(`${API_URL}/expense/category-percentage/${userId}`),
                                          axios.get(`${API_URL}/expense/all/${userId}`)
                                        ]);

                                        if (budgetRes.status === 'fulfilled') {
                                          const bData = budgetRes.value.data;
                                          setCurrentAmount(bData.currentAmount);
                                          setTotalAmount(bData.totalAmount);
                                          setSavingsTarget(bData.savingsTarget || 0);
                                          setSpendableBudget(bData.spendableBudget || bData.totalAmount);
                                        }

                                        if (categoryRes.status === 'fulfilled') {
                                          setCategoryPercentages(categoryRes.value.data?.categoryPercentages || []);
                                        }

                                        if (transactionsRes.status === 'fulfilled') {
                                          const expenses = transactionsRes.value.data?.expenses || [];
                                          const sorted = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
                                          setRecentTransactions(sorted);
                                        }
                                      } catch (e) {
                                        alert("Failed to delete expense");
                                      }
                                    }
                                  }}>
                                    <DeleteIcon fontSize="inherit" />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box p={2} textAlign="center">
                    <Button
                      size="small"
                      onClick={() => navigate('/api/expense/all/' + (user.id || user._id))}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#818cf8',
                        '&:hover': { bgcolor: 'rgba(129, 140, 248, 0.1)' }
                      }}
                    >
                      View Detailed Reports
                    </Button>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} className={styles.fadeInUp}>
                <Card sx={chartCardStyle} className={styles.glassCard}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h5" fontWeight="900" sx={{
                        fontFamily: 'Poppins',
                        background: 'linear-gradient(135deg, #ffffff 0%, #34d399 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mr: 2
                      }}>
                        Current Goals
                      </Typography>
                      <Box sx={{ px: 2, py: 0.5, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50px' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#059669' }}>
                          {goals.length} Active
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => setOpenGoalModal(true)}
                      startIcon={<AddIcon />}
                      sx={{
                        bgcolor: '#10b981',
                        borderRadius: '16px',
                        px: 4,
                        py: 1,
                        fontWeight: 700,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#059669', transform: 'translateY(-2px)' },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      New Goal
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    {goals.length === 0 ? (
                      <Grid item xs={12}>
                        <Box display="flex" flexDirection="column" alignItems="center" py={8} sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                          <Typography variant="body1" sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#64748b' }}>
                            No active goals found. Start saving for your dreams today! 🚀
                          </Typography>
                        </Box>
                      </Grid>
                    ) : (
                      goals.map(goal => (
                        <Grid item xs={12} md={6} lg={4} key={goal.id || goal._id}>
                          <Box sx={{
                            p: 3,
                            borderRadius: '24px',
                            bgcolor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.3s ease',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.06)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)', transform: 'translateY(-4px)' }
                          }}>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                              <Typography variant="h6" fontWeight="800" sx={{ fontFamily: 'Poppins', color: '#f8fafc' }}>{goal.name}</Typography>
                              <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#818cf8', bgcolor: 'rgba(129, 140, 248, 0.1)', px: 1.5, py: 0.5, borderRadius: '8px' }}>
                                {Math.round((goal.saved / goal.amount) * 100)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(100, (goal.saved / goal.amount) * 100)}
                              sx={{
                                height: 12,
                                borderRadius: 6,
                                bgcolor: 'rgba(255,255,255,0.05)',
                                mb: 2,
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #6366f1 0%, #c084fc 100%)',
                                  borderRadius: 6
                                }
                              }}
                            />
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>
                                ₱{goal.saved.toLocaleString()} Saved
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                Target: ₱{goal.amount.toLocaleString()}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))
                    )}
                  </Grid>
                </Card>
              </Grid>

              <Grid item xs={12} sx={{ mt: 6, mb: 8 }}>
                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    onClick={() => navigate('/addform')}
                    startIcon={<AddIcon sx={{ fontSize: '2rem !important' }} />}
                    sx={{
                      bgcolor: '#6366f1',
                      color: 'white',
                      borderRadius: '24px',
                      px: 8,
                      py: 3,
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      textTransform: 'none',
                      fontFamily: 'Poppins',
                      boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.5)',
                      '&:hover': {
                        bgcolor: '#4338CA',
                        transform: 'translateY(-4px) scale(1.02)',
                        boxShadow: '0 30px 60px -12px rgba(79, 70, 229, 0.5)'
                      },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    Add an Expense
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Container>
      </div>

      <Box sx={{ position: 'fixed', bottom: 80, right: 40, zIndex: 2000 }}>
        <MuiTooltip title="Quick Add Expense" placement="left">
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => navigate('/addform')}
            sx={{
              bgcolor: '#6366f1',
              '&:hover': { bgcolor: '#818cf8', transform: 'scale(1.1)' },
              boxShadow: '0 15px 30px -5px rgba(99, 102, 241, 0.6)',
              width: 72, height: 72,
              transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)'
            }}
          >
            <AddIcon sx={{ fontSize: 30 }} />
          </Fab>
        </MuiTooltip>
      </Box >

      <Dialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        PaperProps={{
          style: { borderRadius: 24, padding: '10px' }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 700, textAlign: 'center', pb: 0 }}>Add New Expense</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <TextField
              autoFocus margin="dense" label="Expense Name" fullWidth variant="outlined"
              value={newExpense.name} onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField
              margin="dense" label="Amount" type="number" fullWidth variant="outlined"
              value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField
              margin="dense" fullWidth variant="outlined" select
              SelectProps={{ native: true }}
              value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            >
              <option value="" disabled>Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health</option>
              <option value="Others">Others</option>
            </TextField>
            <TextField
              margin="dense" label="Date" type="date" fullWidth variant="outlined" InputLabelProps={{ shrink: true }}
              value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={() => setOpenAddModal(false)}
            sx={{ borderRadius: '50px', px: 4, textTransform: 'none', color: '#6B7280' }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await axios.post(`${API_URL}/expense/add`, {
                  user: (user.id || user._id),
                  ...newExpense,
                  amount: Number(newExpense.amount)
                });
                setOpenAddModal(false);

                // Refresh budget and expense data
                const userId = user.id || user._id;
                const [budgetRes, categoryRes, transactionsRes] = await Promise.allSettled([
                  axios.get(`${API_URL}/budget/fetch/${userId}`),
                  axios.get(`${API_URL}/expense/category-percentage/${userId}`),
                  axios.get(`${API_URL}/expense/all/${userId}`)
                ]);

                if (budgetRes.status === 'fulfilled') {
                  const bData = budgetRes.value.data;
                  setCurrentAmount(bData.currentAmount);
                  setTotalAmount(bData.totalAmount);
                  setSavingsTarget(bData.savingsTarget || 0);
                  setSpendableBudget(bData.spendableBudget || bData.totalAmount);
                }

                if (categoryRes.status === 'fulfilled') {
                  setCategoryPercentages(categoryRes.value.data?.categoryPercentages || []);
                }

                if (transactionsRes.status === 'fulfilled') {
                  const expenses = transactionsRes.value.data?.expenses || [];
                  const sorted = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
                  setRecentTransactions(sorted);
                }
              } catch (err) {
                alert('Error adding expense');
              }
            }}
            variant="contained"
            sx={{ borderRadius: '50px', px: 6, py: 1, textTransform: 'none', bgcolor: '#4F46E5', '&:hover': { bgcolor: '#4338CA' } }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <AddGoalModal
        open={openGoalModal}
        onClose={() => setOpenGoalModal(false)}
        onGoalAdded={async () => {
          setOpenGoalModal(false);
          // Refresh goals data
          const userEmail = user?.email;
          if (userEmail) {
            const goalsRes = await axios.get(`${API_URL}/goal/email/${userEmail}`);
            setGoals(Array.isArray(goalsRes.data) ? goalsRes.data : []);
          }
        }}
      />

      <BudgetSummaryReport
        open={showSummaryReport}
        onClose={() => setShowSummaryReport(false)}
        userId={user?.id || user?._id}
      />
    </>
  );
};

export default Dashboard;
