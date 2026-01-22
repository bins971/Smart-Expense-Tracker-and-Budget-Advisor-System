import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/login.module.css";
import { AuthContext } from "../../context/AuthContext";
import { API_URL } from "../../apiConfig";
import LoginImg from "../../images/LoginImg.png";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);
  const [userId, setUserId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Both email and password are required.");
      return;
    }

    setIsLoading(true);

    try {
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        // Check if 2FA is required
        if (loginData.require2FA) {
          setRequire2FA(true);
          setUserId(loginData.userId);
          setIsLoading(false);
          return;
        }

        localStorage.setItem("token", loginData.token);

        login({
          id: loginData.user.id,
          email: loginData.user.email,
          username: loginData.user.username
        });

        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/home");
        }, 1000);
      } else {
        setErrorMessage(loginData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/2fa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          token: verificationCode,
          isSetup: false
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        login({
          id: data.user.id,
          email: data.user.email,
          username: data.user.username
        });

        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/home");
        }, 1000);
      } else {
        setErrorMessage(data.message || "Invalid verification code");
      }
    } catch (error) {
      setErrorMessage("An error occurred during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles["login-box"]}>
        <div className={styles["left-side"]}>
          <h2>Welcome Back, Commander.</h2>
          <p>Login to resume control of your financial destiny.</p>
          <img src={LoginImg} alt="Login" />
        </div>
        <div className={styles["right-side"]}>
          <h2>{require2FA ? "Two-Factor Authentication" : "Sign In"}</h2>
          {!require2FA ? (
            <form onSubmit={handleLogin}>
              <div className={styles["input-group"]}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles["input-group"]}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles["login-button"]} disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify2FA}>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', fontFamily: 'Poppins' }}>
                Enter the 6-digit code from your authenticator app
              </p>
              <div className={styles["input-group"]}>
                <label htmlFor="code">Verification Code</label>
                <input
                  type="text"
                  id="code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                  required
                />
              </div>
              <button type="submit" className={styles["login-button"]} disabled={isLoading || verificationCode.length !== 6}>
                {isLoading ? "Verifying..." : "Verify"}
              </button>
              <button
                type="button"
                onClick={() => { setRequire2FA(false); setVerificationCode(''); setErrorMessage(''); }}
                style={{
                  marginTop: '10px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.6)',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'Poppins'
                }}
              >
                Back to Login
              </button>
            </form>
          )}
          {errorMessage && <p className={styles["error-message"]}>{errorMessage}</p>}
          <div className={styles["signup-link"]}>
            <p>
              New to the precision? <Link to="/signup">Join Elite</Link>
            </p>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className={styles["popup"]}>
          <h2>Login Successful!</h2>
          <p>Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default Login;