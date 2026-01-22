import React, { useState, useEffect, useContext } from 'react';
import { API_URL } from "../../apiConfig";
import {
    Container, Typography, Box, Card,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Collapse, Chip, CircularProgress, Button
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";
import styles from '../../styles/home.module.css';

const Row = ({ record }) => {
    const [open, setOpen] = useState(false);
    const archivedDate = new Date(record.archivedDate);

    return (
        <>
            <TableRow sx={{
                '& > *': { borderBottom: 'unset' },
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                transition: 'background-color 0.2s ease'
            }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#f8fafc' }}>
                    {archivedDate.toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ fontFamily: 'Poppins', color: '#cbd5e1' }}>{archivedDate.toLocaleTimeString()}</TableCell>
                <TableCell sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#f8fafc' }}>₱{record.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                    <Chip
                        label={`Saved ₱${record.remainingAmount.toLocaleString()}`}
                        sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            bgcolor: record.remainingAmount > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: record.remainingAmount > 0 ? '#10B981' : '#EF4444',
                            border: `1px solid ${record.remainingAmount > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                            fontSize: '0.75rem'
                        }}
                    />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{
                            margin: 2,
                            padding: 2,
                            borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                            <Typography variant="subtitle1" gutterBottom component="div" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 1 }}>
                                Detailed Breakdown
                            </Typography>
                            <Table size="small" aria-label="expenses">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, fontFamily: 'Poppins', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontFamily: 'Poppins', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontFamily: 'Poppins', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }} align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {record.expenses.map((exp, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#f1f5f9', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{exp.name}</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>{exp.category}</TableCell>
                                            <TableCell align="right" sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>₱{exp.amount.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {record.expenses.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ color: 'rgba(255,255,255,0.3)', py: 2 }}>No expense records in this snapshot.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const BudgetHistoryView = () => {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${API_URL}/budget/history/${user.id}`);
                setHistory(res.data.history || []);
            } catch (err) {
                console.error("Error fetching history", err);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) fetchHistory();
    }, [user]);

    if (loading) {
        return (
            <div className={styles.dbody} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress sx={{ color: '#818cf8' }} />
            </div>
        );
    }

    return (
        <div className={styles.dbody} style={{ paddingBottom: '100px' }}>
            <Container maxWidth="lg" sx={{ pt: 12 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={6} className={styles.fadeInUp}>
                    <Box>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/home')}
                            sx={{
                                color: '#a5b4fc',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontFamily: 'Poppins',
                                mb: 1,
                                '&:hover': { background: 'rgba(129, 140, 248, 0.1)' }
                            }}
                        >
                            Return to Dashboard
                        </Button>
                        <Typography variant="h3" sx={{ fontFamily: 'Poppins', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
                            Budget Archives
                        </Typography>
                    </Box>

                    <Box sx={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px 25px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'right' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Cycles</Typography>
                        <Typography sx={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 800 }}>{history.length}</Typography>
                    </Box>
                </Box>

                <Card sx={{
                    borderRadius: '28px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(24px)',
                    position: 'relative'
                }} className={styles.fadeInUp}>
                    <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
                        <Table stickyHeader aria-label="budget history table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ bgcolor: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
                                    <TableCell sx={{
                                        bgcolor: 'rgba(15, 23, 42, 0.8)',
                                        fontWeight: 600,
                                        fontFamily: 'Poppins',
                                        color: 'rgba(255,255,255,0.5)',
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1.5px',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                                    }}>Date Captured</TableCell>
                                    <TableCell sx={{
                                        bgcolor: 'rgba(15, 23, 42, 0.8)',
                                        fontWeight: 600,
                                        fontFamily: 'Poppins',
                                        color: 'rgba(255,255,255,0.5)',
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1.5px',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                                    }}>Timestamp</TableCell>
                                    <TableCell sx={{
                                        bgcolor: 'rgba(15, 23, 42, 0.8)',
                                        fontWeight: 600,
                                        fontFamily: 'Poppins',
                                        color: 'rgba(255,255,255,0.5)',
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1.5px',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                                    }}>Allocated Budget</TableCell>
                                    <TableCell sx={{
                                        bgcolor: 'rgba(15, 23, 42, 0.8)',
                                        fontWeight: 600,
                                        fontFamily: 'Poppins',
                                        color: 'rgba(255,255,255,0.5)',
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1.5px',
                                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                                    }}>Performance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.map((record) => (
                                    <Row key={record.id || record._id} record={record} />
                                ))}
                                {history.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 12, border: 'none' }}>
                                            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                                                <Box sx={{ p: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <Typography variant="h2" sx={{ opacity: 0.2 }}>📁</Typography>
                                                </Box>
                                                <Typography variant="h6" sx={{ fontFamily: 'Poppins', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                                                    No archived data found
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.3)', maxWidth: '300px' }}>
                                                    Your financial journey hasn't been archived yet. Your records will appear here once you reset a budget cycle.
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Container>
        </div>
    );
};

export default BudgetHistoryView;
