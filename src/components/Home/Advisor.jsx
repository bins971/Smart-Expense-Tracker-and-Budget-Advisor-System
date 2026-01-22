import React, { useState, useContext, cloneElement } from 'react';
import { API_URL } from "../../apiConfig";
import { Container, Card, Typography, Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Paper, Avatar, Grid, Chip } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarsIcon from '@mui/icons-material/Stars';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import styles from '../../styles/home.module.css';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Advisor = () => {
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openPopup, setOpenPopup] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const generateAdvice = async () => {
        setLoading(true);
        setError('');
        setAdvice('');
        try {
            const response = await axios.post(`${API_URL}/advisor/advice`, {
                userId: user?.id || user?._id
            });
            const adviceText = response.data.advice;
            setAdvice(adviceText);

            if (adviceText.toLowerCase().includes("critical") || adviceText.toLowerCase().includes("alert")) {
                setOpenPopup(true);
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'The intelligence engine is currently unavailable. Please verify your API key.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.dbody}>
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
                    <IconButton onClick={() => navigate('/home')} sx={{ mr: 2, color: '#ffffff', bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h3" sx={{ fontFamily: 'Poppins', fontWeight: 950, color: '#ffffff', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(129, 140, 248, 0.3))' }}>
                        Wealth Intelligence
                    </Typography>
                </Box>

                {error && (
                    <Box sx={{ mb: 4 }} className={styles.fadeInUp}>
                        <Paper sx={{ p: 3, bgcolor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '24px', textAlign: 'center' }}>
                            <Typography variant="body1" sx={{ color: '#f8fafc', fontWeight: 600, fontFamily: 'Poppins', mb: 1.5 }}>
                                {error}
                            </Typography>
                            <Button variant="outlined" color="error" size="small" onClick={generateAdvice} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, borderColor: '#f43f5e', color: '#f43f5e', '&:hover': { bgcolor: 'rgba(244, 63, 94, 0.1)' } }}>
                                Retry Intelligence Boot
                            </Button>
                        </Paper>
                    </Box>
                )}

                <Card sx={{
                    borderRadius: '40px',
                    background: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(32px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.8)',
                    overflow: 'hidden'
                }} className={styles.fadeInUp}>
                    <Box sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                        p: 6,
                        color: 'white',
                        textAlign: 'center',
                        position: 'relative',
                        boxShadow: 'inset 0 -20px 40px -10px rgba(0,0,0,0.3)'
                    }}>
                        <Avatar sx={{ width: 120, height: 120, bgcolor: 'rgba(255,255,255,0.1)', margin: '0 auto 24px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)' }}>
                            <PsychologyIcon sx={{ fontSize: 70, color: 'white' }} />
                        </Avatar>
                        <Typography variant="h3" fontWeight="950" sx={{ fontFamily: 'Poppins', mb: 1, letterSpacing: '-0.04em', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }}>Neural Advisor</Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, fontFamily: 'Poppins', fontWeight: 600, letterSpacing: '0.05em' }}>NEXT-GEN WEALTH INTELLIGENCE</Typography>
                    </Box>

                    <Box sx={{ p: 5 }}>
                        {!advice && !loading && (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Grid container spacing={4} sx={{ mb: 6 }}>
                                    {[
                                        { icon: <TrendingUpIcon />, title: "Pattern Engine", desc: "Identifies deep behavioral trends." },
                                        { icon: <StarsIcon />, title: "Precision Advice", desc: "Tactical moves to optimize cashflow." },
                                        { icon: <SmartToyIcon />, title: "Neural Forecasting", desc: "Projected end-of-period outcomes." }
                                    ].map((item, i) => (
                                        <Grid item xs={12} md={4} key={i}>
                                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', height: '100%', transition: 'all 0.3s ease', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(99, 102, 241, 0.3)' } }}>
                                                <Box sx={{ color: '#818cf8', mb: 2 }}>{cloneElement(item.icon, { sx: { fontSize: 40 } })}</Box>
                                                <Typography variant="h6" fontWeight="800" sx={{ fontFamily: 'Poppins', mb: 1, color: '#ffffff' }}>{item.title}</Typography>
                                                <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Button
                                    variant="contained"
                                    onClick={generateAdvice}
                                    sx={{
                                        px: 8,
                                        py: 2.5,
                                        borderRadius: '50px',
                                        fontSize: '1.2rem',
                                        fontWeight: 900,
                                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                                        boxShadow: '0 20px 40px -10px rgba(79, 70, 229, 0.4)',
                                        textTransform: 'none',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.5)' },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Initialize Intelligence Report
                                </Button>
                            </Box>
                        )}

                        {loading && (
                            <Box sx={{ textAlign: 'center', py: 10 }}>
                                <CircularProgress thickness={5} size={70} sx={{ color: '#818cf8', mb: 4 }} />
                                <Typography variant="h5" sx={{ fontFamily: 'Poppins', color: '#ffffff', fontWeight: 900, mb: 1, letterSpacing: '-0.02em' }} className={styles.loadingPulse}>
                                    Synthesizing Financial Structures...
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                                    Neural AI is analyzing burn rates, subscription leakage, and velocity metrics.
                                </Typography>
                            </Box>
                        )}

                        {advice && !loading && (
                            <Box className={styles.fadeInUp}>
                                <Paper elevation={0} sx={{
                                    p: 5,
                                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                                    borderRadius: '32px',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    position: 'relative',
                                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)'
                                }}>
                                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Chip
                                            icon={<StarsIcon style={{ color: 'white' }} />}
                                            label="INTELLIGENCE REPORT ACTIVE"
                                            sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', border: '1px solid #6366f1', color: '#ffffff', fontWeight: 900, p: 1, borderRadius: '8px', letterSpacing: '0.05em' }}
                                        />
                                        <Typography variant="caption" sx={{ color: '#9CA3AF', fontWeight: 600 }}>
                                            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </Typography>
                                    </Box>

                                    <Box sx={{
                                        fontFamily: 'Poppins',
                                        color: '#cbd5e1',
                                        '& h3': {
                                            color: '#ffffff',
                                            mt: 5,
                                            mb: 2,
                                            fontWeight: 900,
                                            fontSize: '1.6rem',
                                            borderLeft: '4px solid #6366f1',
                                            pl: 2,
                                            letterSpacing: '-0.02em'
                                        },
                                        '& p': { mb: 2, lineHeight: 1.8, fontSize: '1.1rem' },
                                        '& ul, & ol': { mb: 3, pl: 3 },
                                        '& li': { mb: 2, lineHeight: 1.7, fontSize: '1.05rem' },
                                        '& strong': { color: '#818cf8', fontWeight: 800 }
                                    }}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {advice}
                                        </ReactMarkdown>
                                    </Box>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={generateAdvice}
                                        sx={{
                                            mt: 6,
                                            borderRadius: '16px',
                                            py: 2,
                                            borderStyle: 'dashed',
                                            textTransform: 'none',
                                            fontWeight: 800,
                                            color: '#818cf8',
                                            borderColor: 'rgba(129, 140, 248, 0.3)',
                                            '&:hover': { borderStyle: 'solid', bgcolor: 'rgba(129, 140, 248, 0.05)', borderColor: '#818cf8' }
                                        }}
                                    >
                                        Regenerate Analysis
                                    </Button>
                                </Paper>
                            </Box>
                        )}
                    </Box>
                </Card>

                <Dialog open={openPopup} onClose={() => setOpenPopup(false)} PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}>
                    <DialogTitle sx={{ color: '#EF4444', fontWeight: 800, fontFamily: 'Poppins', fontSize: '1.5rem' }}>
                        Critical Budget Alert
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" sx={{ fontFamily: 'Poppins', color: '#4B5563' }}>
                            Our advisor has detected that you've surpassed **50% of your allocated budget**. We recommend prioritizing essential costs for the rest of the period.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setOpenPopup(false)} variant="contained" sx={{ bgcolor: '#EF4444', borderRadius: '12px', px: 4, '&:hover': { bgcolor: '#DC2626' } }}>
                            Optimize My Spend
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
};

export default Advisor;
