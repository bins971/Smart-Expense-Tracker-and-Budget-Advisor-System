import React, { useState, useContext } from 'react';
import { API_URL } from "../../apiConfig";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Alert, MenuItem
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AddGoalModal = ({ open, onClose, onGoalAdded }) => {
    const { user } = useContext(AuthContext);
    const [goalData, setGoalData] = useState({
        name: "",
        amount: "",
        saved: "",
        description: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        priority: "Medium"
    });
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGoalData({ ...goalData, [name]: value });
    };

    const handleSubmit = async () => {
        setError("");

        // Basic Validation
        if (!goalData.name || !goalData.amount || !goalData.endDate) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            const goalPayload = {
                email: user.email,
                ...goalData,
                amount: Number(goalData.amount),
                saved: Number(goalData.saved) || 0
            };

            const response = await axios.post(`${API_URL}/goal/usercreate`, goalPayload);
            if (response.status === 201) {
                onGoalAdded();
                onClose();
                setGoalData({
                    name: "", amount: "", saved: "", description: "",
                    startDate: new Date().toISOString().split('T')[0], endDate: "", priority: "Medium"
                });
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to create goal.");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
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
            <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em', mb: 1 }}>Add New Financial Goal</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}

                <TextField
                    autoFocus margin="dense" label="Goal Name" name="name" fullWidth variant="outlined"
                    value={goalData.name} onChange={handleInputChange} required
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
                <TextField
                    margin="dense" label="Target Amount (₱)" name="amount" type="number" fullWidth variant="outlined"
                    value={goalData.amount} onChange={handleInputChange} required
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
                <TextField
                    margin="dense" label="Already Saved (Optional)" name="saved" type="number" fullWidth variant="outlined"
                    value={goalData.saved} onChange={handleInputChange}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
                <TextField
                    margin="dense" label="Start Date" name="startDate" type="date" fullWidth variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={goalData.startDate} onChange={handleInputChange}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
                <TextField
                    margin="dense" label="Target Date" name="endDate" type="date" fullWidth variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={goalData.endDate} onChange={handleInputChange} required
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
                <TextField
                    margin="dense" label="Priority" name="priority" select fullWidth variant="outlined"
                    value={goalData.priority} onChange={handleInputChange}
                    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                </TextField>
                <TextField
                    margin="dense" label="Description" name="description" multiline rows={3} fullWidth variant="outlined"
                    value={goalData.description} onChange={handleInputChange}
                    sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: '#ffffff' }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 4, gap: 2 }}>
                <Button onClick={onClose} sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        borderRadius: '16px',
                        bgcolor: '#6366f1',
                        px: 4,
                        py: 1.5,
                        fontWeight: 800,
                        textTransform: 'none',
                        boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
                        '&:hover': { bgcolor: '#818cf8' }
                    }}
                >
                    Create Goal
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddGoalModal;
