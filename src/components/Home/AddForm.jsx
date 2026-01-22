import React, { useContext, useState } from "react";
import styles from "../../styles/addform.module.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext.js";
import { API_URL } from "../../apiConfig";
const StyledForm = () => {
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState("");
  const [showGuardrail, setShowGuardrail] = useState(false);
  const [isProceeding, setIsProceeding] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const handleCategoryChange = (e) => {
    if (e.target.value === "custom") {
      setIsCustomCategory(true);
    } else {
      setIsCustomCategory(false);
      setCategory(e.target.value);
    }
  };
  console.log("user")
  console.log(user)
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // High-Value Guardrail Logic
    if (parseFloat(amount) >= 1000 && !isProceeding) {
      setShowGuardrail(true);
      return;
    }

    try {
      const expenseData = {
        user: user.id,
        category: isCustomCategory ? customCategory : category,
        name,
        amount: parseFloat(amount),
        date,
        description,
        mood,
        isHighValue: parseFloat(amount) >= 1000
      };

      const response = await fetch(`${API_URL}/expense/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      const result = await response.json();
      if (response.ok) {
        navigate("/home", { state: { expense: result.expense } });
      } else {
        alert(result.error || "Failed to add expense.");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("An error occurred while adding the expense.");
    }
  };

  const handleConfirmHighValue = () => {
    setIsProceeding(true);
    setShowGuardrail(false);
    // Use a timeout to ensure state updates before calling submit
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => { } };
      handleSubmit(fakeEvent);
    }, 100);
  };


  const handleBack = () => {
    navigate("/home");
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formLeft}>
        <div className={styles.welcomeIcon}></div>
        <h2 className={styles.welcomeTitle}>Expense</h2>
        <p className={styles.welcomeText}>Fill in your expense details!</p>
        <button className={styles.backButton} onClick={handleBack}>GO BACK</button>
      </div>
      <div className={styles.formRight}>
        <h3 className={styles.formTitle}>Expense Details</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <select
              value={category}
              onChange={handleCategoryChange}
              className={styles.input}
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="shopping">Shopping</option>
              <option value="entertainment">Entertainment</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {isCustomCategory && (
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          )}
          <div className={styles.formRow}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formRow}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formRow}>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formRow}>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              rows="2"
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.moodLabel}>MARKET PSYCHOLOGY (MOOD)</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className={styles.input}
            >
              <option value="">Select Emotion/Trigger</option>
              <option value="Planned">Elite (Planned/Strategic)</option>
              <option value="Impulse">Pulse (Impulse/Dopamine)</option>
              <option value="Stressed">Heated (Stressed/Panic)</option>
              <option value="Essential">Vital (Essential/Static)</option>
              <option value="Investment">Growth (Investment/Compound)</option>
            </select>
          </div>
          <button type="submit" className={styles.submitButton}>
            ADD
          </button>
        </form>
      </div>

      {showGuardrail && (
        <div className={styles.modalOverlay}>
          <div className={styles.guardrailModal}>
            <div className={styles.guardrailIcon}>⚠️</div>
            <h3 className={styles.guardrailTitle}>High-Value Guardrail Activated</h3>
            <p className={styles.guardrailText}>
              You are attempting to confirm a transaction of <strong>${amount}</strong>.
              Our neural engine suggests a "Cooling Period" for values of this magnitude.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowGuardrail(false)}>Wait & Review</button>
              <button className={styles.confirmBtn} onClick={handleConfirmHighValue}>I am Certain</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StyledForm;
