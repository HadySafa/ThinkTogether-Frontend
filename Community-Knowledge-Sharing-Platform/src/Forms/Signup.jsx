import styles from "./style.module.css";
import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { manager } = location.state || {};

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [error, setError] = useState(null);
  const [missingField, setMissingField] = useState(null);

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    phonenumber: '',
    password: '',
    password_confirmation: '',
    role: manager ? "Manager" : "User"  // ✅ changed to lowercase
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function checkUserAvailable(username) {
    const url = `http://localhost:8000/api/check-username?username=${username}`;
    try {
      const response = await fetch(url,{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer' + token
        },
      });
      if (!response.ok) throw new Error("");
      const available = await response.json();
      return available.available;
    } catch (error) {
      return false;
    }
  }

  async function handleUsernameBlur(e) {
    const username = e.target.value;
    const available = await checkUserAvailable(username);
    if (!available) {
      setUsernameError("Username not available, try another one.");
      setFormData(prev => ({ ...prev, username: '' }));
    } else {
      setUsernameError('');
    }
  }

  function handlePasswordBlur(e) {
    const password = e.target.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (password && !passwordRegex.test(password)) {
      setPasswordError('Password must be at least 8 characters, containing a number, lowercase and uppercase characters.');
    } else {
      setPasswordError('');
    }
  }

  function handleConfirmPasswordBlur(e) {
    const confirmPassword = e.target.value;
    if (confirmPassword && formData.password !== confirmPassword) {
      setFormData(prev => ({ ...prev, password_confirmation: '' }));
      setConfirmPasswordError("Passwords don't match.");
    } else {
      setConfirmPasswordError('');
    }
  }

  async function addNewUser(formData) {
    const url = "http://localhost:8000/api/register";
    try {
      setError(false);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer" + token },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error("SignUp Failed");
      const data = await response.json();
      if (data) {
        navigate(manager ? "/Homepage" : "/");
        setError(false);
      }
    } catch (err) {
      setError(true);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (formData.fullname && formData.username && formData.phonenumber && formData.password && formData.password_confirmation) {
      addNewUser(formData);
      setFormData({
        fullname: '',
        username: '',
        phonenumber: '',
        password: '',
        password_confirmation: '',
        role: "User"  // ✅ lowercase
      });
    } else {
      setMissingField(true);
    }
  }

  function handleReset() {
    setMissingField(false);
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setFormData({
      fullname: '',
      username: '',
      phonenumber: '',
      password: '',
      password_confirmation: '',
      role: 'User'  // ✅ lowercase
    });
  }

  return (
    <form onSubmit={handleSubmit} onReset={handleReset} className={styles.form}>

      <div className={styles.headerContainer}>
        <h2>Create New Account</h2>
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          className={styles.input}
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
        />
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="username">Username</label>
        <input
          onBlur={handleUsernameBlur}
          name="username"
          value={formData.username}
          onChange={handleChange}
          type="text"
          id="username"
          className={`${styles.input} ${usernameError ? styles.inputError : ''}`}
        />
        {usernameError && <div style={{ color: 'red' }}>{usernameError}</div>}
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="number">Phone Number</label>
        <input
          type="number"
          name="phonenumber"
          value={formData.phonenumber}
          onChange={handleChange}
          id="number"
          className={styles.input}
        />
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="password">Password</label>
        <input
          onBlur={handlePasswordBlur}
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          id="password"
          className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
        />
        {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
        <input
          onBlur={handleConfirmPasswordBlur}
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          type="password"
          id="confirmPassword"
          className={`${styles.input} ${confirmPasswordError ? styles.inputError : ''}`}
        />
        {confirmPasswordError && <div style={{ color: 'red' }}>{confirmPasswordError}</div>}
      </div>

      {missingField && <div style={{ color: 'red', textAlign: "start" }}>All fields are required</div>}

      <div className={styles.buttonsContainer}>
        <button className={styles.cancel} type="reset">Cancel</button>
        <button className={styles.submit} type="submit">Sign Up</button>
      </div>

    </form>
  );
}

export default SignUp;
