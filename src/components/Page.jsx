
import React from 'react';
import { Container, Button, AppBar, Toolbar, Box, Typography, Grid } from '@mui/material';
import { Link } from "react-router-dom";

import SecurityIcon from '@mui/icons-material/Security';
import MemoryIcon from '@mui/icons-material/Memory';
import InsightsIcon from '@mui/icons-material/Insights';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import GppGoodIcon from '@mui/icons-material/GppGood';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { BLOG_POSTS } from '../data/blogData';

const FEATURES = [
    { title: "Neural Insights", desc: "Our AI engine analyzes burn rates to predict your end-of-month liquidity with 98% accuracy.", color: "#6366f1" },
    { title: "Smart Budgeting", desc: "Automated targets that adjust in real-time based on your spending velocity.", color: "#10b981" },
    { title: "Vault Security", desc: "Enterprise-grade encryption for all your financial headers and metadata.", color: "#f43f5e" }
];

const STATS = [
    { label: "Assets Managed", value: "₱12.4B+" },
    { label: "Neural Insights", value: "850K+" },
    { label: "Active Architects", value: "10K+" }
];

const TESTIMONIALS = [
    { name: "Adrian Chen", role: "Venture Architect", text: "The wealth projection terminal is eerily accurate. It changed how I allocate capital." },
    { name: "Sarah Jenkins", role: "Legacy Designer", text: "Finally, a finance tool that feels like it belongs in 2026. Crystalline UI and deep logic." },
    { name: "Marcus Thorne", role: "Capital Strategist", text: "Precision Wealth isn't just a tracker; it's a strategic partner for my financial future." },
    { name: "Elena Rodriguez", role: "FinTech Founder", text: "The neural insights gave me the clarity I needed to scale my personal ventures." },
    { name: "David Vance", role: "Systems Architect", text: "The most sophisticated burn-rate analysis I've ever encountered in a consumer app." },
    { name: "Sophia Loren", role: "Asset Manager", text: "It's the absolute gold standard for modern wealth management and transparency." }
];

const PROTOCOL_STEPS = [
    { title: "Initialization", desc: "Define your financial parameters and secure your vault headers.", icon: <LockIcon /> },
    { title: "Neural Sync", desc: "Our AI processes your spending velocity and capital flow in real-time.", icon: <MemoryIcon /> },
    { title: "Architectural Forecast", desc: "Receive precision wealth projections and structural advice.", icon: <InsightsIcon /> }
];

const SECURITY_PILARS = [
    { title: "AES-256 Protocol", desc: "Military-grade encryption for all financial metadata.", icon: <ShieldIcon /> },
    { title: "Zero-Knowledge", desc: "Your data is encrypted locally; even we cannot decrypt your wealth records.", icon: <LockIcon /> },
    { title: "SOC-2 Standard", desc: "Certified compliance with global financial security frameworks.", icon: <GppGoodIcon /> }
];

const FAQ_ITEMS = [
    { q: "Is my data truly private?", a: "Yes. Using our Zero-Knowledge architecture, all sensitive data is encrypted before it leaves your device. Only you hold the keys." },
    { q: "How accurate is the AI projection?", a: "Our models achieve 98% accuracy based on historical spend tracking and macroeconomic velocity processing." },
    { q: "Can I cancel my Neural Pro subscription?", a: "Abort at any time. We believe in absolute freedom; no lock-ins, no legacy hurdles." },
    { q: "Do you support international currencies?", a: "Currently optimized for PHP, with real-time global exchange processing for USD, EUR, and SGD sync." }
];


function Page() {
    return (
        <Box sx={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', bgcolor: '#020617' }}>
            {/* Nav */}
            <AppBar position="fixed" sx={{ background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: 'none' }}>
                <Toolbar>
                    <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Typography variant="h5" sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 950,
                            letterSpacing: '-0.04em',
                            background: 'linear-gradient(135deg, #ffffff 0%, #818cf8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 10px rgba(129, 140, 248, 0.3))'
                        }}>
                            SMART EXPENSE
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Typography sx={{ color: '#94a3b8', fontWeight: 700, '&:hover': { color: '#ffffff' }, transition: '0.3s' }}>Sign In</Typography>
                            </Link>
                            <Link to="/signup" style={{ textDecoration: 'none' }}>
                                <Button sx={{
                                    borderRadius: '14px',
                                    textTransform: 'none',
                                    background: '#6366f1',
                                    color: 'white',
                                    px: 4,
                                    py: 1.2,
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)',
                                    '&:hover': { background: '#4f46e5', transform: 'translateY(-2px)' },
                                    transition: '0.3s'
                                }}>
                                    Join Precision
                                </Button>
                            </Link>
                        </Box>
                    </Container>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ pt: 12, pb: 6, position: 'relative', zIndex: 1 }}>
                <Box sx={{ textAlign: 'center', animation: 'fadeInUp 1.2s cubic-bezier(0.19, 1, 0.22, 1)' }}>
                    <Box sx={{
                        display: 'inline-block',
                        px: 3,
                        py: 1,
                        mb: 3,
                        borderRadius: '50px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#818cf8',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase'
                    }}>
                        Financially Intelligent • AI Driven
                    </Box>
                    <Typography variant="h1" sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 950,
                        color: '#ffffff',
                        fontSize: { xs: '2.5rem', md: '5rem' },
                        lineHeight: 1.1,
                        mb: 3,
                        letterSpacing: '-0.05em'
                    }}>
                        Control Your <Box component="span" sx={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #818cf8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Wealth</Box> with Precision.
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#94a3b8', maxWidth: '700px', mx: 'auto', mb: 5, lineHeight: 1.6, fontWeight: 500, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                        The most sophisticated expense management ecosystem designed for the modern architect of wealth. AI-powered insights, deep analytics, and crystalline focus.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mb: 6 }}>
                        <Link to="/signup" style={{ textDecoration: 'none' }}>
                            <Button sx={{
                                borderRadius: '20px',
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                                color: 'white',
                                px: 6,
                                py: 2.5,
                                fontWeight: 900,
                                fontSize: '1.2rem',
                                boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.5)',
                                '&:hover': { transform: 'translateY(-5px) scale(1.02)' },
                                transition: '0.4s cubic-bezier(0.19, 1, 0.22, 1)'
                            }}>
                                Start Trading Better
                            </Button>
                        </Link>
                    </Box>

                    {/* Stats Counter */}
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                        {STATS.map((s, i) => (
                            <Grid item xs={12} sm={4} key={i}>
                                <Box sx={{ p: 4, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                                    <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 900, mb: 1 }}>{s.value}</Typography>
                                    <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>{s.label}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

            {/* Feature Bento Grid (MOVED UP) */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 950, color: '#ffffff', mb: 2, letterSpacing: '-0.03em' }}>The Architecture.</Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '1.2rem' }}>Every tool you need to build a financial empire.</Typography>
                </Box>
                <Grid container spacing={4}>
                    {FEATURES.map((f, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Box sx={{
                                p: 5,
                                borderRadius: '40px',
                                background: 'rgba(15, 23, 42, 0.5)',
                                backdropFilter: 'blur(32px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                height: '100%',
                                transition: '0.4s',
                                '&:hover': { background: 'rgba(15, 23, 42, 0.8)', borderColor: f.color, transform: 'translateY(-10px)' }
                            }}>
                                <Typography variant="h4" fontWeight="950" sx={{ color: '#ffffff', mb: 3, letterSpacing: '-0.02em' }}>{f.title}</Typography>
                                <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.8 }}>{f.desc}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* The Precision Protocol (How It Works) (MOVED UP) */}
            <Box sx={{ bgcolor: 'rgba(2, 6, 23, 0.8)', py: 6 }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h3" sx={{ fontWeight: 950, color: '#ffffff', mb: 2, letterSpacing: '-0.03em' }}>The Precision Protocol.</Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '1.2rem' }}>A 3-step engine designed for absolute clarity.</Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {PROTOCOL_STEPS.map((s, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <Box sx={{
                                    p: 5,
                                    borderRadius: '32px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    background: 'rgba(255,255,255,0.02)',
                                    textAlign: 'center',
                                    height: '100%'
                                }}>
                                    <Box sx={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: '20px',
                                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                                        color: '#818cf8',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 4,
                                        '& svg': { fontSize: '2rem' }
                                    }}>
                                        {s.icon}
                                    </Box>
                                    <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 800, mb: 2 }}>{s.title}</Typography>
                                    <Typography sx={{ color: '#94a3b8', lineHeight: 1.6 }}>{s.desc}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Interactive Forecaster Section (MOVED DOWN) */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Box sx={{
                    p: { xs: 4, md: 8 },
                    borderRadius: '40px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" sx={{ fontWeight: 950, color: '#ffffff', mb: 3, letterSpacing: '-0.03em' }}>
                                Dynamic <Box component="span" sx={{ color: '#818cf8' }}>Forecasting</Box>
                            </Typography>
                            <Typography sx={{ color: '#94a3b8', fontSize: '1.2rem', mb: 4, lineHeight: 1.8 }}>
                                Witness your financial future in real-time. Our neural engine processes thousands of variables to architect your legacy.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ px: 3, py: 1, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <Typography sx={{ color: '#10b981', fontWeight: 800, fontSize: '0.9rem' }}>+24% ROI Prediction</Typography>
                                </Box>
                                <Box sx={{ px: 3, py: 1, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                    <Typography sx={{ color: '#818cf8', fontWeight: 800, fontSize: '0.9rem' }}>Deep Meta-Analysis</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                bgcolor: '#0f172a',
                                p: 4,
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                fontFamily: 'monospace',
                                position: 'relative'
                            }}>
                                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f43f5e' }} />
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#eab308' }} />
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                                </Box>
                                <Typography sx={{ color: '#6366f1', mb: 1 }}>{'>'} initializing_wealth_model...</Typography>
                                <Typography sx={{ color: '#10b981', mb: 1 }}>{'>'} burn_rate_optimized: 14.2%</Typography>
                                <Typography sx={{ color: '#ffffff', mb: 2 }}>{'>'} wealth_at_2027: ₱24,500,000</Typography>
                                <Box sx={{ width: '100%', height: 4, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                                    <Box sx={{ width: '70%', height: '100%', bgcolor: '#818cf8', borderRadius: 2 }} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            {/* Quantum Security */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 6, borderRadius: '40px', background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.05) 0%, rgba(2, 6, 23, 1) 100%)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                            <SecurityIcon sx={{ fontSize: '4rem', color: '#f43f5e', mb: 4 }} />
                            <Typography variant="h3" sx={{ fontWeight: 950, color: '#ffffff', mb: 3, letterSpacing: '-0.03em' }}>Quantum Security.</Typography>
                            <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                                We architect your financial safety with military-grade protocols. Your data isn't just protected; it's practically invisible to external threats.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={4}>
                            {SECURITY_PILARS.map((p, i) => (
                                <Grid item xs={12} key={i}>
                                    <Box sx={{ display: 'flex', gap: 3, p: 4, borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Box sx={{ color: '#f43f5e' }}>{p.icon}</Box>
                                        <Box>
                                            <Typography sx={{ color: '#ffffff', fontWeight: 800, mb: 1 }}>{p.title}</Typography>
                                            <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>{p.desc}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            {/* Neural Trust (Testimonials) - Infinite Scroll v2 */}
            <Container maxWidth="xl" sx={{ py: 6, overflow: 'hidden' }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 950, color: '#ffffff', mb: 2, letterSpacing: '-0.03em' }}>Neural Trust.</Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '1.2rem' }}>What the architects of modern wealth are saying.</Typography>
                </Box>

                <style>
                    {`
                        @keyframes scroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(calc(-350px * 6 - 2rem * 6)); }
                        }
                        .marquee-container {
                            display: flex;
                            gap: 2rem;
                            width: max-content;
                            animation: scroll 40s linear infinite;
                        }
                        .marquee-container:hover {
                            animation-play-state: paused;
                        }
                    `}
                </style>

                <Box className="marquee-container">
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                        <Box key={i} sx={{
                            width: '350px',
                            p: 5,
                            borderRadius: '32px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            transition: '0.4s cubic-bezier(0.19, 1, 0.22, 1)',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderColor: 'rgba(99, 102, 241, 0.3)',
                                transform: 'scale(1.02)'
                            }
                        }}>
                            <Typography sx={{ color: '#ffffff', fontSize: '1.05rem', fontStyle: 'italic', mb: 4, lineHeight: 1.6 }}>"{t.text}"</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box>
                                    <Typography sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.9rem' }}>{t.name}</Typography>
                                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>{t.role}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>

            {/* Intelligent Journal Section */}
            <Container maxWidth="lg" sx={{ pb: 6 }}>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 950, color: '#ffffff', mb: 2, letterSpacing: '-0.03em' }}>
                        Intelligent <Box component="span" sx={{ color: '#818cf8' }}>Journal</Box>
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '1.2rem' }}>Insights from the frontiers of financial technology.</Typography>
                </Box>
                <Grid container spacing={4}>
                    {BLOG_POSTS.map((b, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Link to={`/blog/${b.id}`} style={{ textDecoration: 'none' }}>
                                <Box sx={{
                                    p: 5,
                                    borderRadius: '32px',
                                    background: 'rgba(15, 23, 42, 0.3)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: '0.4s cubic-bezier(0.19, 1, 0.22, 1)',
                                    '&:hover': {
                                        background: 'rgba(99, 102, 241, 0.03)',
                                        borderColor: 'rgba(129, 140, 248, 0.3)',
                                        transform: 'translateY(-10px) scale(1.02)',
                                        boxShadow: '0 30px 60px -15px rgba(0,0,0,0.5)'
                                    }
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{b.category}</Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>{b.readingTime}</Typography>
                                    </Box>
                                    <Typography variant="h5" fontWeight="800" sx={{ color: '#ffffff', mb: 2, lineHeight: 1.3 }}>{b.title}</Typography>
                                    <Typography sx={{ color: '#94a3b8', mb: 4, lineHeight: 1.6, fontSize: '0.95rem' }}>{b.desc}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography sx={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 700, borderBottom: '1px solid #ffffff', pb: 0.5 }}>Read Article</Typography>
                                    </Box>
                                </Box>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Neural FAQ */}
            <Box sx={{ bgcolor: 'rgba(2, 6, 23, 0.8)', py: 6 }}>
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h3" sx={{ fontWeight: 950, color: '#ffffff', mb: 2, letterSpacing: '-0.03em' }}>FAQ'S</Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '1.2rem' }}>Decoding common inquiries about the platform.</Typography>
                    </Box>
                    <Box>
                        {FAQ_ITEMS.map((item, i) => (
                            <Accordion key={i} sx={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                color: '#ffffff',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                mb: 2,
                                borderRadius: '16px !important',
                                boxShadow: 'none',
                                '&:before': { display: 'none' }
                            }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#818cf8' }} />}>
                                    <Typography sx={{ fontWeight: 700, p: 1 }}>{item.q}</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', pt: 3 }}>
                                    <Typography sx={{ color: '#94a3b8', lineHeight: 1.8 }}>{item.a}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Global Footer */}
            <Box sx={{ background: '#010413', py: 6, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h5" sx={{ fontWeight: 950, color: '#ffffff', mb: 4 }}>SMART EXPENSE</Typography>
                            <Typography sx={{ color: '#64748b', lineHeight: 1.8, mb: 4 }}>Architecting the next generation of financial intelligence tools for the ambitious global citizen.</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography sx={{ color: '#ffffff', fontWeight: 900, mb: 3 }}>System</Typography>
                            {['Insights', 'Budgets', 'Archives', 'Forecasts'].map(l => (
                                <Typography key={l} sx={{ color: '#64748b', mb: 1.5, cursor: 'pointer', '&:hover': { color: '#ffffff' } }}>{l}</Typography>
                            ))}
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography sx={{ color: '#ffffff', fontWeight: 900, mb: 3 }}>Company</Typography>
                            {['Vision', 'Security', 'Journal', 'Partners'].map(l => (
                                <Typography key={l} sx={{ color: '#64748b', mb: 1.5, cursor: 'pointer', '&:hover': { color: '#ffffff' } }}>{l}</Typography>
                            ))}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 4, borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <Typography sx={{ color: '#ffffff', fontWeight: 800, mb: 2 }}>Ready for Precision?</Typography>
                                <Link to="/signup" style={{ textDecoration: 'none' }}>
                                    <Button fullWidth sx={{ bgcolor: '#6366f1', color: 'white', fontWeight: 800, py: 1.5, borderRadius: '12px' }}>Initialize Account</Button>
                                </Link>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Typography sx={{ color: '#475569', fontSize: '0.8rem' }}>© 2026 Smart Expense Tracker. All Rights Reserved.</Typography>
                        <Typography sx={{ color: '#475569', fontSize: '0.8rem' }}>Precision Wealth Control Protocol v4.2.0</Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}

export default Page;
