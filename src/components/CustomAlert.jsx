import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

function CustomAlert({ open, onClose, title, message, type = 'success' }) {
    const iconMap = {
        success: <CheckCircleIcon style={{ color: '#10b981', fontSize: '3rem' }} />,
        error: <ErrorIcon style={{ color: '#ef4444', fontSize: '3rem' }} />,
        warning: <WarningIcon style={{ color: '#f59e0b', fontSize: '3rem' }} />,
        info: <InfoIcon style={{ color: '#3b82f6', fontSize: '3rem' }} />
    };

    const colorMap = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                style: {
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    textAlign: 'center'
                }
            }}
        >
            <DialogContent style={{ paddingTop: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                    {iconMap[type]}
                </div>
                {title && (
                    <DialogTitle style={{
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                        color: '#ffffff',
                        fontSize: '1.5rem',
                        padding: '0 0 12px 0'
                    }}>
                        {title}
                    </DialogTitle>
                )}
                <Typography style={{
                    fontFamily: 'Poppins',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1.05rem',
                    lineHeight: '1.6'
                }}>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center', paddingTop: '20px', paddingBottom: '10px' }}>
                <Button onClick={onClose} style={{
                    fontFamily: 'Poppins',
                    color: '#ffffff',
                    fontWeight: 600,
                    borderRadius: '12px',
                    padding: '10px 32px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    background: `linear-gradient(135deg, ${colorMap[type]} 0%, ${colorMap[type]}dd 100%)`,
                    boxShadow: `0 4px 12px ${colorMap[type]}66`
                }}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CustomAlert;
