import React, { useState, useEffect } from "react";
import { API_URL } from "../../apiConfig";
import NoData from "../../images/NoData.png";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/home.module.css";
import { useAuth } from "../../context/AuthContext";

const Achievement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [historyAchievements, setHistoryAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userId = user?.id || user?._id;
      if (userId) {
        setLoading(true);
        try {
          const [goalsRes, historyRes] = await Promise.all([
            axios.get(`${API_URL}/goal/email/${user.email}`),
            axios.get(`${API_URL}/budget/history/${userId}`)
          ]);
          const completedGoals = Array.isArray(goalsRes.data)
            ? goalsRes.data.filter(g => g.saved >= g.amount)
            : [];
          setGoals(completedGoals);
          const achievements = Array.isArray(historyRes.data) ? historyRes.data.filter(h => h.achievement) : [];
          setHistoryAchievements(achievements);
        } catch (error) {
          console.error("Error fetching achievement data:", error);
          setError(true);
        } finally {
          setLoading(false);
        }
      } else if (user === null) {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);


  return (
    <div className={styles.dbody}>
      <Container maxWidth="lg" sx={{ pt: 12 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
            <CircularProgress sx={{ color: '#818cf8' }} />
          </Box>
        ) : error ? (
          <Box textAlign="center" py={10}>
            <img src={NoData} alt="Error" style={{ maxWidth: "200px", opacity: 0.5 }} />
            <Typography sx={{ color: '#ef4444', mt: 2, fontFamily: 'Poppins' }}>Unable to load achievements</Typography>
          </Box>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={8} className={styles.fadeInUp}>
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
                <Typography variant="h3" sx={{
                  fontWeight: 900,
                  fontFamily: 'Poppins',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(129, 140, 248, 0.2))'
                }}>
                  Achievement Vault
                </Typography>
              </Box>

              <Box sx={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '15px 25px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'right'
              }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Earned Medals</Typography>
                <Typography sx={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 800 }}>{historyAchievements.length + goals.length}</Typography>
              </Box>
            </Box>

            {(historyAchievements.length > 0 || goals.length > 0) ? (
              <Grid container spacing={4} className={styles.fadeInUp}>
                {historyAchievements.map((ach, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`hist-${index}`}>
                    <Paper
                      sx={{
                        padding: 4,
                        textAlign: 'center',
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                        borderRadius: '32px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        '&:hover': { transform: 'translateY(-12px)', borderColor: 'rgba(129, 140, 248, 0.4)', background: 'rgba(255, 255, 255, 0.05)' }
                      }}
                    >
                      <Typography variant="h2" sx={{ mb: 2, filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.2))' }}>
                        {ach.achievement ? ach.achievement.split(' ')[0] : '🏆'}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#ffffff', fontFamily: 'Poppins', mb: 1 }}>
                        {ach.achievement ? ach.achievement.split(' ').slice(1).join(' ') : 'Achievement'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Poppins', mb: 3 }}>
                        Strategic Budget Mastery
                      </Typography>
                      <Box sx={{ display: 'inline-flex', px: 2, py: 0.5, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>
                          Performance: {Math.round((ach.remainingAmount / ach.totalAmount) * 100)}% Saved
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}

                {goals.map((goal) => (
                  <Grid item xs={12} sm={6} md={4} key={goal.id || goal._id}>
                    <Paper
                      sx={{
                        padding: 4,
                        textAlign: 'center',
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                        borderRadius: '32px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        '&:hover': { transform: 'translateY(-12px)', borderColor: 'rgba(16, 185, 129, 0.4)', background: 'rgba(255, 255, 255, 0.05)' }
                      }}
                    >
                      <Typography variant="h2" sx={{ mb: 2, filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.2))' }}>🚀</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#ffffff', fontFamily: 'Poppins', mb: 1 }}>
                        Goal Mastered
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Poppins', mb: 3 }}>
                        {goal.name} Target Secured
                      </Typography>
                      <Box sx={{ display: 'inline-flex', px: 2, py: 0.5, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: '50px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>
                          Objective Complete
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                className: styles.fadeInUp
              }}>
                <Paper sx={{
                  p: 8,
                  textAlign: 'center',
                  borderRadius: '40px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  maxWidth: '500px'
                }}>
                  <Box sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto mb 4',
                    border: '1px solid rgba(255,255,255,0.05)',
                    mb: 4
                  }}>
                    <Typography fontSize="3rem" sx={{ opacity: 0.2 }}>🔒</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontFamily: 'Poppins', fontWeight: 800, color: '#ffffff', mb: 2 }}>
                    Vault is Locked
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                    Your financial achievements are currently under lock and key. Keep hitting your savings goals and mastering your budget to unlock elite medals!
                  </Typography>
                </Paper>
              </Box>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Achievement;
