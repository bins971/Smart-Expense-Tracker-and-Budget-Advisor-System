import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styles from '../styles/home.module.css';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from "react-router-dom";
import GradeIcon from '@mui/icons-material/Grade';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from '@mui/material';


import { AuthContext } from "../context/AuthContext";

function CustomNavbar() {
    const { user } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const getDisplayName = () => {
        if (user?.username) return user.username.toUpperCase();
        if (user?.email) return user.email.split("@")[0].toUpperCase();
        return "FINANCE";
    };

    const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);

    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    const handleLogoutConfirm = () => {
        setOpenLogoutDialog(false);
        localStorage.removeItem('authToken');
        navigate("/");
    };

    const handleLogoutCancel = () => {
        setOpenLogoutDialog(false);
    };


    return (
        <Navbar expand="lg" className={styles.navbody} variant="light">
            <Container fluid>
                <Link to="/Dashboard" style={{ textDecoration: 'none' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 24px',
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 10px 30px 0 rgba(0, 0, 0, 0.4)',
                    }}>
                        <span style={{
                            fontSize: '1.25rem',
                            fontWeight: '950',
                            fontFamily: 'Poppins',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            background: 'linear-gradient(135deg, #ffffff 0%, #818cf8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 10px rgba(129, 140, 248, 0.3))'
                        }}>
                            {getDisplayName()}'S TRACKER
                        </span>
                    </div>
                </Link>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    />
                    <button id="loginbutton" onClick={handleLogoutClick} className="btn" style={{
                        fontWeight: 800,
                        color: '#ffffff',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '8px 20px',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Poppins'
                    }}>
                        LogOut
                    </button>

                    <div>
                        <Link to="/achievement" className={styles.profile} title="Achievements">
                            <GradeIcon />
                        </Link>
                    </div>
                    <div>
                        <Link to="/advisor" className={styles.profile} style={{ marginRight: '15px' }} title="AI Advisor">
                            <SmartToyIcon />
                        </Link>
                    </div>
                    <div>
                        <Link to="/how-it-works" className={styles.profile} style={{ marginRight: '15px' }} title="How It Works">
                            <HelpOutlineIcon />
                        </Link>
                    </div>
                    <div>
                        <Link to="/profile" className={styles.profile}>
                            <PersonIcon />
                        </Link>
                    </div>
                </Navbar.Collapse>
                <Dialog
                    open={openLogoutDialog}
                    onClose={handleLogoutCancel}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    PaperProps={{
                        style: {
                            background: 'rgba(15, 23, 42, 0.95)',
                            backdropFilter: 'blur(20px) saturate(180%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '24px',
                            padding: '16px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            minWidth: '320px'
                        }
                    }}
                >
                    <DialogTitle id="alert-dialog-title" style={{
                        fontFamily: 'Poppins',
                        fontWeight: 700,
                        color: '#ffffff',
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                        {"Confirm Logout"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" style={{
                            fontFamily: 'Poppins',
                            color: 'rgba(255, 255, 255, 0.7)',
                            textAlign: 'center',
                            fontSize: '1.05rem',
                            marginBottom: '10px'
                        }}>
                            Are you sure you want to end your session?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ justifyContent: 'center', gap: '12px', paddingBottom: '16px' }}>
                        <Button onClick={handleLogoutCancel} style={{
                            fontFamily: 'Poppins',
                            color: '#ffffff',
                            fontWeight: 600,
                            borderRadius: '12px',
                            padding: '8px 24px',
                            textTransform: 'none',
                            fontSize: '1rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleLogoutConfirm} style={{
                            fontFamily: 'Poppins',
                            color: '#ffffff',
                            fontWeight: 600,
                            borderRadius: '12px',
                            padding: '8px 24px',
                            textTransform: 'none',
                            fontSize: '1rem',
                            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                            border: 'none'
                        }} autoFocus>
                            Logout
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Navbar>
    );
}
export default CustomNavbar; 