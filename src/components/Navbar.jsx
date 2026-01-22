import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styles from '../styles/home.module.css';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from "react-router-dom";
import GradeIcon from '@mui/icons-material/Grade';
import SmartToyIcon from '@mui/icons-material/SmartToy';


import { AuthContext } from "../context/AuthContext";

function CustomNavbar() {
    const { user } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const getDisplayName = () => {
        if (user?.username) return user.username.toUpperCase();
        if (user?.email) return user.email.split("@")[0].toUpperCase();
        return "FINANCE";
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('authToken');
            navigate("/");
        }
    }


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
                    <button id="loginbutton" onClick={handleLogout} className="btn" style={{
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
                        <Link to="/profile" className={styles.profile}>
                            <PersonIcon />
                        </Link>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default CustomNavbar; 