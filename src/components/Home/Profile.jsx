import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from "../../context/AuthContext.js";
import { API_URL } from "../../apiConfig";
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Typography } from '@mui/material';

import TwoFactorSetup from './TwoFactorSetup';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [edituser, setUser] = useState({
    username: '',
    email: '',
    age: '',
    gender: '',
    dob: '',
    workingStatus: '',
    mfaEnabled: false,
  });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("**")
  console.log(user)
  localStorage.setItem('userEmail', user?.email);

  const loggedInUserEmail = localStorage.getItem('userEmail');
  console.log(loggedInUserEmail);

  const genderOptions = ['Male', 'Female', 'Other'];
  const workingStatusOptions = ['Student', 'Housewife', 'Working Professional'];
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = user?.id || user?._id;
      if (!userId) return;

      try {
        const response = await fetch(`${API_URL}/auth/by-profile/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("all")
        console.log(data.username)
        if (response.ok) {
          setUser({
            username: data.username || '',
            email: data.email || '',
            age: data.age || '',
            gender: data.gender || '',
            dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
            workingStatus: data.workingStatus || '',
            mfaEnabled: data.mfaEnabled || false,
          });

          if (!data.username || !data.age) {
            setEditMode(true);
          }
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (loggedInUserEmail) {
      fetchUserData();
    }
  }, [user?.id, user?._id, loggedInUserEmail]);
  const handleChange = (e) => {
    setUser({
      ...edituser,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = () => {
    setEditMode((prev) => !prev);
  };

  const handleSave = async () => {
    if (editMode) {
      try {
        const response = await fetch(`${API_URL}/auth/update/${loggedInUserEmail}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(edituser),
        });

        if (response.ok) {
          console.log('Profile updated successfully');
        } else {
          console.error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
    setEditMode(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <IconButton
          onClick={() => navigate('/home')}
          sx={{
            color: 'white',
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            transition: 'all 0.3s ease',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'translateY(-50%) scale(1.1)' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <h2 style={styles.headerText}>Profile</h2>
      </div>
      <div style={styles.profileContainer}>
        <div style={styles.gridContainer}>
          <div style={styles.fieldContainer}>
            <label style={styles.label}>Name:</label>
            <input
              type="text"
              name="username"
              value={edituser.username}
              onChange={handleChange}
              style={{ ...styles.input, ...(!editMode ? styles.disabledInput : {}) }}
              disabled={!editMode}
            />
          </div>
          <div style={styles.fieldContainer}>
            <label style={styles.label}>Age:</label>
            <input
              type="number"
              name="age"
              value={edituser.age}
              onChange={handleChange}
              style={{ ...styles.input, ...(!editMode ? styles.disabledInput : {}) }}
              disabled={!editMode}
            />
          </div>
          <div style={styles.fieldContainer}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="email"
              value={edituser.email}
              onChange={handleChange}
              style={{ ...styles.input, ...styles.disabledInput }}
              disabled
            />
          </div>

          <div style={styles.fieldContainer}>
            <label style={styles.label}>Gender:</label>
            <select
              name="gender"
              value={edituser.gender}
              onChange={handleChange}
              style={{ ...styles.input, ...(!editMode ? styles.disabledInput : {}) }}
              disabled={!editMode}
            >
              {genderOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.fieldContainer}>
            <label style={styles.label}>Work Profile:</label>
            <select
              name="workingStatus"
              value={edituser.workingStatus}
              onChange={handleChange}
              style={{ ...styles.input, ...(!editMode ? styles.disabledInput : {}) }}
              disabled={!editMode}
            >
              {workingStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.fieldContainer}>
            <label style={styles.label}>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={edituser.dob}
              onChange={handleChange}
              style={{ ...styles.input, ...(!editMode ? styles.disabledInput : {}) }}
              disabled={!editMode}
            />
          </div>
        </div>

        {/* Vault Security Section */}
        <div style={{
          marginTop: '50px',
          padding: '30px',
          borderRadius: '24px',
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(129, 140, 248, 0.2)'
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight="900" sx={{ color: '#ffffff', fontFamily: 'Poppins', mb: 0.5 }}>Vault Security (2FA)</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Architect defensive perimeters around your financial destiny.</Typography>
            </Box>
            <TwoFactorSetup />
          </Box>

          {/* Business Mode Link */}
          <Box sx={{
            mt: 4,
            p: 3,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(129, 140, 248, 0.2)',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)'
            }
          }}
            onClick={() => {
              // Show loading animation
              const loadingDiv = document.createElement('div');
              loadingDiv.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(15, 23, 42, 0.95);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 9999;
              backdrop-filter: blur(10px);
            `;
              loadingDiv.innerHTML = `
              <div style="text-align: center;">
                <div style="
                  width: 60px;
                  height: 60px;
                  border: 4px solid rgba(129, 140, 248, 0.2);
                  border-top-color: #818cf8;
                  border-radius: 50%;
                  animation: spin 0.8s linear infinite;
                  margin: 0 auto 20px;
                "></div>
                <p style="color: #ffffff; font-family: Poppins; font-size: 1.2rem;">Loading Business Dashboard...</p>
              </div>
              <style>
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              </style>
            `;
              document.body.appendChild(loadingDiv);

              // Redirect after animation
              setTimeout(() => {
                navigate('/business');
              }, 800);
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                💼
              </Box>
              <Box flex={1}>
                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, mb: 0.5 }}>
                  Business Mode
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Track revenue, ROI, profit & loss, and business metrics
                </Typography>
              </Box>
              <Typography sx={{ color: '#818cf8', fontSize: '1.5rem' }}>→</Typography>
            </Box>
          </Box>
        </div>

        <button onClick={handleEditClick} style={styles.editButton}>
          {editMode ? 'Cancel' : 'Edit'}
        </button>
        {editMode && (
          <button onClick={handleSave} style={styles.saveButton}>
            Save
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '90%',
    maxWidth: '1000px',
    margin: '40px auto 80px auto',
    padding: '40px',
    background: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(32px) saturate(180%)',
    borderRadius: '40px',
    boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#ffffff'
  },
  header: {
    background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    padding: '40px',
    borderRadius: '32px',
    color: 'white',
    textAlign: 'center',
    marginBottom: '40px',
    boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.4)',
    position: 'relative',
  },
  headerText: {
    margin: 0,
    fontSize: '2.5rem',
    fontWeight: 950,
    fontFamily: 'Poppins',
    letterSpacing: '-0.03em',
    background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))'
  },
  profileContainer: {
    marginTop: '20px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Responsive grid
    gap: '30px',
  },
  fieldContainer: {
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#94a3b8',
    marginLeft: '4px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    marginTop: '12px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: '#ffffff',
    fontFamily: 'Poppins',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  disabledInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    cursor: 'not-allowed',
    color: '#94a3b8',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  editButton: {
    padding: '14px 40px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 800,
    marginTop: '40px',
    fontFamily: 'Poppins',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
  },
  saveButton: {
    padding: '14px 40px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 800,
    marginTop: '40px',
    marginLeft: '15px',
    fontFamily: 'Poppins',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
  },
};

export default Profile;
