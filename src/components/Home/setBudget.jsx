import React, { useState, useEffect, useContext } from 'react';
import styles from '../../styles/addform.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext.js";
import axios from 'axios';
import { API_URL } from "../../apiConfig";
import { Box, Typography } from '@mui/material';
import CustomAlert from '../CustomAlert';

const BudgetForm = () => {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [totalAmount, setTotalAmount] = useState(null);
  const [savingsTarget, setSavingsTarget] = useState(0);
  const [startdate, setstartdate] = useState(null);
  const [enddate, setenddate] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBudgetData = async () => {
      if (!user || !user.id) return;
      try {
        const response1 = await axios.get(`${API_URL}/budget/fetch/${user.id}`);

        // Setting totalAmount
        setTotalAmount(response1.data.totalAmount);

        // Formatting start date
        if (response1.data.startdate) {
          const startdate = new Date(response1.data.startdate);
          if (!isNaN(startdate.getTime())) {
            setstartdate(startdate.toISOString().split('T')[0]);
          }
        }

        // Formatting end date
        if (response1.data.enddate) {
          const enddate = new Date(response1.data.enddate);
          if (!isNaN(enddate.getTime())) {
            setenddate(enddate.toISOString().split('T')[0]);
          }
        }

        setBudgetData(response1.data);

        // Setting savings target
        if (response1.data.savingsTarget !== undefined) {
          setSavingsTarget(response1.data.savingsTarget);
        }

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchBudgetData();
  }, [user]);


  const handleBack = () => {
    navigate("/home");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = user?.id || user?._id;
      if (!userId) {
        setError('User not found');
        return;
      }
      const url = budgetData ? `${API_URL}/budget/update/${userId}` : `${API_URL}/budget/create`;
      console.log("id")

      const method = budgetData ? 'PUT' : 'POST';

      const body = {
        user: user.id,
        totalAmount,
        savingsTarget: savingsTarget || 0,
        currentAmount: totalAmount,
        startDate: startdate,
        endDate: enddate,
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setAlertMessage('Budget ' + (method === 'POST' ? 'created' : 'updated') + ' successfully!');
        setAlertOpen(true);
        setTimeout(() => navigate('/home'), 1500);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to set budget');
      }
    } catch (err) {
      setError('Error setting budget');
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formLeft}>
        <div className={styles.welcomeIcon}></div>
        <h2 className={styles.welcomeTitle}>Budget</h2>
        <p className={styles.welcomeText}>Fill in your Budget details!</p>

        <Box sx={{ mt: 4, mb: 4, textAlign: 'left', px: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1.5, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.9 }}>
            🏆 How to earn medals
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: 'rgba(255, 255, 255, 0.03)', p: 2, borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Typography variant="caption" sx={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <span style={{ fontSize: '1.4rem' }}>🥇</span> <Box component="span" sx={{ fontWeight: 600 }}>Save 30%+</Box> for Gold
            </Typography>
            <Typography variant="caption" sx={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <span style={{ fontSize: '1.4rem' }}>🥈</span> <Box component="span" sx={{ fontWeight: 600 }}>Save 15% - 29%</Box> for Silver
            </Typography>
            <Typography variant="caption" sx={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <span style={{ fontSize: '1.4rem' }}>🥉</span> <Box component="span" sx={{ fontWeight: 600 }}>Save 5% - 14%</Box> for Bronze
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ display: 'block', mt: 2, fontStyle: 'italic', color: '#94a3b8' }}>
            * Achievement is awarded when you set a NEW budget period.
          </Typography>
        </Box>

        <button className={styles.backButton} onClick={handleBack}>GO BACK</button>
      </div>
      <div className={styles.formRight}>
        <h3 className={styles.formTitle}>Details</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label>Amount</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formRow}>
            <label>Savings Target (Optional)</label>
            <input
              type="number"
              value={savingsTarget}
              onChange={(e) => setSavingsTarget(Number(e.target.value) || 0)}
              className={styles.input}
              placeholder="0"
              min="0"
            />
          </div>

          {totalAmount && savingsTarget > 0 && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 700, fontFamily: 'Poppins' }}>
                💰 Available for spending: ₱{(totalAmount - savingsTarget).toLocaleString()}
              </Typography>
            </Box>
          )}

          <div className={styles.formRow}>
            <label>Start Date</label>
            <input
              type="date"
              value={startdate}
              onChange={(e) => setstartdate(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formRow}>
            <label>End Date</label>
            <input
              type="date"
              value={enddate}
              onChange={(e) => setenddate(e.target.value)}
              className={styles.input}
              required
            />
          </div>



          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" className={styles.submitButton}>
            SET
          </button>
        </form>
      </div>
      <CustomAlert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
        type="success"
      />
    </div>
  );
};

export default BudgetForm;
