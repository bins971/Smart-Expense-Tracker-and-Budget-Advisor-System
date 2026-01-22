import React, { useState, useContext } from 'react';
import { API_URL } from '../../apiConfig';
import { AuthContext } from '../../context/AuthContext';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Alert
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

function TwoFactorSetup() {
    const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [step, setStep] = useState('initial'); // initial, qr, verify, complete

    const handleEnable2FA = async () => {
        try {
            setError('');
            const response = await fetch(`${API_URL}/auth/2fa/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            const data = await response.json();
            if (response.ok) {
                setQrCode(data.qrCode);
                setSecret(data.secret);
                setStep('qr');
            } else {
                setError(data.message || 'Failed to generate 2FA');
            }
        } catch (err) {
            setError('Network error generating 2FA');
        }
    };

    const handleVerify = async () => {
        try {
            setError('');
            const response = await fetch(`${API_URL}/auth/2fa/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    token: verificationCode,
                    isSetup: true
                })
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('2FA enabled successfully!');
                setStep('complete');
                setTimeout(() => {
                    setOpen(false);
                }, 2000);
            } else {
                setError(data.message || 'Invalid verification code');
            }
        } catch (err) {
            setError('Network error verifying code');
        }
    };

    const handleOpen = () => {
        setOpen(true);
        setStep('initial');
        setError('');
        setSuccess('');
        setVerificationCode('');
    };

    const handleClose = () => {
        setOpen(false);
        setStep('initial');
        setQrCode('');
        setSecret('');
        setVerificationCode('');
        setError('');
        setSuccess('');
    };

    return (
        <>
            <Button
                variant="contained"
                startIcon={<SecurityIcon />}
                onClick={handleOpen}
                disabled={user?.mfaEnabled}
                style={{
                    background: user?.mfaEnabled
                        ? 'rgba(255,255,255,0.1)'
                        : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    borderRadius: '12px',
                    padding: '10px 24px',
                    textTransform: 'none',
                    boxShadow: user?.mfaEnabled ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.4)'
                }}
            >
                {user?.mfaEnabled ? '2FA Enabled ✓' : 'Enable 2FA'}
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        padding: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }
                }}
            >
                <DialogTitle style={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    color: '#ffffff',
                    fontSize: '1.5rem',
                    textAlign: 'center'
                }}>
                    <SecurityIcon style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Enable Two-Factor Authentication
                </DialogTitle>

                <DialogContent>
                    {error && <Alert severity="error" style={{ marginBottom: '16px', fontFamily: 'Poppins' }}>{error}</Alert>}
                    {success && <Alert severity="success" style={{ marginBottom: '16px', fontFamily: 'Poppins' }}>{success}</Alert>}

                    {step === 'initial' && (
                        <Box>
                            <Typography style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Poppins', marginBottom: '16px' }}>
                                Add an extra layer of security to your account by enabling two-factor authentication.
                            </Typography>
                            <Typography style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Poppins', fontSize: '0.9rem' }}>
                                You'll need an authenticator app like Google Authenticator or Microsoft Authenticator.
                            </Typography>
                        </Box>
                    )}

                    {step === 'qr' && (
                        <Box textAlign="center">
                            <Typography style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Poppins', marginBottom: '16px' }}>
                                Scan this QR code with your authenticator app:
                            </Typography>
                            {qrCode && (
                                <img
                                    src={qrCode}
                                    alt="2FA QR Code"
                                    style={{
                                        width: '200px',
                                        height: '200px',
                                        margin: '0 auto',
                                        background: 'white',
                                        padding: '10px',
                                        borderRadius: '12px'
                                    }}
                                />
                            )}
                            <Typography style={{
                                color: 'rgba(255,255,255,0.5)',
                                fontFamily: 'Poppins',
                                fontSize: '0.8rem',
                                marginTop: '16px',
                                wordBreak: 'break-all'
                            }}>
                                Manual entry key: {secret}
                            </Typography>
                            <TextField
                                fullWidth
                                label="Enter 6-digit code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="000000"
                                inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem' } }}
                                style={{ marginTop: '24px' }}
                                InputLabelProps={{
                                    style: { color: 'rgba(255,255,255,0.6)', fontFamily: 'Poppins' }
                                }}
                                InputProps={{
                                    style: {
                                        color: '#ffffff',
                                        fontFamily: 'Poppins',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px'
                                    }
                                }}
                            />
                        </Box>
                    )}

                    {step === 'complete' && (
                        <Box textAlign="center">
                            <Typography style={{ color: '#10b981', fontFamily: 'Poppins', fontSize: '1.2rem', fontWeight: 600 }}>
                                ✓ 2FA Successfully Enabled!
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions style={{ justifyContent: 'center', gap: '12px', paddingBottom: '16px' }}>
                    {step === 'initial' && (
                        <>
                            <Button onClick={handleClose} style={{
                                fontFamily: 'Poppins',
                                color: '#ffffff',
                                fontWeight: 600,
                                borderRadius: '12px',
                                padding: '8px 24px',
                                textTransform: 'none',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                Cancel
                            </Button>
                            <Button onClick={handleEnable2FA} style={{
                                fontFamily: 'Poppins',
                                color: '#ffffff',
                                fontWeight: 600,
                                borderRadius: '12px',
                                padding: '8px 24px',
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                            }}>
                                Continue
                            </Button>
                        </>
                    )}

                    {step === 'qr' && (
                        <>
                            <Button onClick={handleClose} style={{
                                fontFamily: 'Poppins',
                                color: '#ffffff',
                                fontWeight: 600,
                                borderRadius: '12px',
                                padding: '8px 24px',
                                textTransform: 'none',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleVerify}
                                disabled={verificationCode.length !== 6}
                                style={{
                                    fontFamily: 'Poppins',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    borderRadius: '12px',
                                    padding: '8px 24px',
                                    textTransform: 'none',
                                    background: verificationCode.length === 6
                                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                        : 'rgba(255,255,255,0.1)',
                                    boxShadow: verificationCode.length === 6 ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none'
                                }}
                            >
                                Verify & Enable
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}

export default TwoFactorSetup;
