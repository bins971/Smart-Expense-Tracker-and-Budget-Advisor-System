import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, Button, TextField, MenuItem, IconButton, Card, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";
import { API_URL } from "../../apiConfig";

const Subscriptions = () => {
    const { user } = useContext(AuthContext);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [newSub, setNewSub] = useState({ name: '', amount: '', cycle: 'Monthly', category: 'Subscription', startDate: new Date().toISOString().split('T')[0] });

    const fetchSubscriptions = useCallback(async () => {
        try {
            if (!user?.id) return;
            const res = await axios.get(`${API_URL}/subscription/get/${user.id}`);
            setSubscriptions(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching subscriptions", error);
            setLoading(false);
        }


    }, [user?.id]);

    useEffect(() => {
        if (user && user.id) {
            fetchSubscriptions();
        }
    }, [user, fetchSubscriptions]);

    const handleAdd = async () => {
        try {
            const res = await axios.post(`${API_URL}/subscription/add`, { ...newSub, user: user.id });
            setSubscriptions([...subscriptions, res.data]);
            setOpen(false);
            setNewSub({ name: '', amount: '', cycle: 'Monthly', category: 'Subscription', startDate: new Date().toISOString().split('T')[0] });
        } catch (error) {
            console.error("Error adding subscription", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/subscription/delete/${id}`);
            setSubscriptions(subscriptions.filter(sub => (sub.id || sub._id) !== id));
        } catch (error) {
            console.error("Error deleting subscription", error);
        }
    };

    const getTotalMonthly = () => {
        if (!Array.isArray(subscriptions)) return 0;
        return subscriptions.reduce((acc, sub) => {
            return acc + (sub.cycle === 'Monthly' ? sub.amount : sub.amount / 12);
        }, 0);
    };

    return (
        <Card sx={{
            borderRadius: '32px',
            p: 3,
            height: '100%',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(32px) saturate(180%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
            color: '#ffffff',
            '&:hover': {
                transform: 'translateY(-10px) scale(1.02)',
                background: 'rgba(30, 41, 59, 0.8)',
                borderColor: 'rgba(99, 102, 241, 0.6)',
                boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.8)'
            }
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Poppins' }}>Subscriptions</Typography>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    size="small"
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)',
                        '&:hover': { background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' }
                    }}
                    onClick={() => setOpen(true)}
                >
                    Add
                </Button>
            </Box>

            <Box mb={2}>
                <Typography variant="body2" sx={{ color: '#94a3b8', fontFamily: 'Poppins' }}>Est. Monthly Cost</Typography>
                <Typography variant="h3" fontWeight="900" sx={{ fontFamily: 'Poppins', my: 2, color: '#ffffff', letterSpacing: '-0.02em' }}>
                    ₱{getTotalMonthly().toFixed(2)}
                </Typography>
            </Box>

            <Box sx={{ maxHeight: '250px', overflowY: 'auto' }}>
                {loading ? <CircularProgress size={24} /> : subscriptions.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" align="center" mt={2}>No subscriptions yet.</Typography>
                ) : (
                    subscriptions.map(sub => (
                        <Box key={sub.id || sub._id} display="flex" justifyContent="space-between" alignItems="center" p={2} mb={1.5} sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Box>
                                <Typography variant="subtitle2" fontWeight="700" color="#f1f5f9">{sub.name}</Typography>
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>{sub.cycle} • Next: {new Date(sub.nextPaymentDate).toLocaleDateString()}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Typography variant="subtitle2" fontWeight="800" mr={1} sx={{ color: '#f8fafc' }}>₱{sub.amount}</Typography>
                                <IconButton size="small" sx={{ color: '#f43f5e', '&:hover': { bgcolor: 'rgba(244, 63, 94, 0.1)' } }} onClick={() => handleDelete(sub.id || sub._id)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(32px) saturate(180%)',
                        borderRadius: '32px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.8)',
                        color: '#ffffff',
                        p: 2
                    }
                }}
            >
                <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Add Subscription</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus margin="dense" label="Name (e.g., Netflix)" fullWidth variant="outlined"
                        value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                        sx={{ mb: 2, mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                    />
                    <TextField
                        margin="dense" label="Amount" type="number" fullWidth variant="outlined"
                        value={newSub.amount} onChange={(e) => setNewSub({ ...newSub, amount: e.target.value })}
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                    />
                    <TextField
                        select margin="dense" label="Cycle" fullWidth variant="outlined"
                        value={newSub.cycle} onChange={(e) => setNewSub({ ...newSub, cycle: e.target.value })}
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                    >
                        <MenuItem value="Monthly">Monthly</MenuItem>
                        <MenuItem value="Yearly">Yearly</MenuItem>
                    </TextField>
                    <TextField
                        select margin="dense" label="Category" fullWidth variant="outlined"
                        value={newSub.category || 'Subscription'} onChange={(e) => setNewSub({ ...newSub, category: e.target.value })}
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                    >
                        <MenuItem value="Subscription">Subscription</MenuItem>
                        <MenuItem value="Entertainment">Entertainment</MenuItem>
                        <MenuItem value="Utility">Utility</MenuItem>
                        <MenuItem value="Work">Work</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                    <TextField
                        margin="dense" label="Start Date" type="date" fullWidth variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={newSub.startDate} onChange={(e) => setNewSub({ ...newSub, startDate: e.target.value })}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 4, gap: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
                    <Button
                        onClick={handleAdd}
                        variant="contained"
                        sx={{
                            borderRadius: '16px',
                            bgcolor: '#10b981',
                            px: 4,
                            py: 1.5,
                            fontWeight: 800,
                            textTransform: 'none',
                            boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
                            '&:hover': { bgcolor: '#34d399' }
                        }}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default Subscriptions;
