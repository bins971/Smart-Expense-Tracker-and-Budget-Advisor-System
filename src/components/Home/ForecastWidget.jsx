import React, { useState, useEffect, useContext, useCallback } from 'react';
import { API_URL } from "../../apiConfig";
import { Card, Box, Typography, CircularProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";

const ForecastWidget = () => {
    const { user } = useContext(AuthContext);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchForecast = useCallback(async () => {
        try {
            if (!user?.id) return;
            const res = await axios.get(`${API_URL}/advisor/forecast/${user.id}`);
            setForecast(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching forecast", error);
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user && user.id) {
            fetchForecast();
        }
    }, [user, fetchForecast]);

    if (loading) return <CircularProgress size={20} />;

    const trendIcon = forecast?.trend === 'up' ? <TrendingUpIcon sx={{ color: '#EF4444' }} /> :
        forecast?.trend === 'caution' ? <TrendingFlatIcon sx={{ color: '#F59E0B' }} /> :
            forecast?.trend === 'down' ? <TrendingDownIcon sx={{ color: '#10B981' }} /> :
                <TrendingFlatIcon sx={{ color: '#94a3b8' }} />;

    const trendColor = forecast?.trend === 'up' ? '#EF4444' :
        forecast?.trend === 'caution' ? '#F59E0B' :
            forecast?.trend === 'down' ? '#10B981' : '#94a3b8';

    const trendText = forecast?.statusMessage || (forecast?.trend === 'up' ? 'Predicted to Exceed Budget' :
        forecast?.trend === 'down' ? 'On Track to Save' : 'Stable Spending');

    // Show days remaining or "End of Period" message
    const daysLabel = forecast?.daysRemaining > 0
        ? `Projected by end of period (${forecast.daysRemaining} days left)`
        : 'Budget Period Ended';

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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Poppins', color: '#f8fafc' }}>AI Prediction</Typography>
                {trendIcon}
            </Box>

            <Typography variant="body2" sx={{ fontFamily: 'Poppins', color: '#94a3b8' }}>
                {daysLabel}
            </Typography>

            <Typography variant="h3" fontWeight="900" sx={{ fontFamily: 'Poppins', my: 2, color: '#ffffff', letterSpacing: '-0.02em' }}>
                ₱{forecast?.predictedAmount?.toLocaleString()}
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Spendable Target</Typography>
                    <Typography variant="caption" sx={{ color: '#f8fafc', fontWeight: 700 }}>₱{forecast?.spendableBudget?.toLocaleString()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Monthly Savings Velocity</Typography>
                    <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>+₱{forecast?.savingsVelocity?.toLocaleString()}</Typography>
                </Box>
            </Box>

            <Box display="flex" alignItems="center" bgcolor="rgba(255,255,255,0.03)" p={1} borderRadius={4} border="1px solid rgba(255,255,255,0.05)">
                <Typography variant="caption" fontWeight="bold" sx={{ color: trendColor, fontFamily: 'Poppins' }}>
                    {trendText}
                </Typography>
            </Box>
        </Card>
    );
};

export default ForecastWidget;
