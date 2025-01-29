import styles from "./style.module.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

function SignUp() {

  const navigate = useNavigate();

  // username validation
  const [usernameError, setUsernameError] = useState('');
  async function checkUserAvailable(username) {
    const url = "http://localhost/SharingPlatform/api.php/Users/CheckUser/" + username;
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error("");
      return true
    }
    catch (error) {
      return false
    }
  }
  async function handleUsernameBlur(e) {
    const username = e.target.value;
    let usernameAvailable = await checkUserAvailable(username)
    if (usernameAvailable) {
      setUsernameError("Username not available, try another one.")
      e.target.value = ""
    }
    else setUsernameError('');
  }


  const location = useLocation();
  const { manager } = location.state || {};

  // password and confrim password validation
  const [passwordError, setPasswordError] = useState('');
  function handlePasswordBlur(e) {
    const submittedPassword = e.target.value;
    if (submittedPassword && submittedPassword.length > 0) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(submittedPassword)) setPasswordError('Password must be at least 8 characters, containing a number, lowercase and uppercase characters.');
      else setPasswordError('');
    }
    else setPasswordError('');
  };
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  function handleConfirmPasswordBlur(e) {
    let submittedConfirmPassword = e.target.value;
    if (submittedConfirmPassword && formData.Password) {
      if (submittedConfirmPassword !== formData.Password) {
        setFormData(prevState => ({
          ...prevState,
          ConfirmedPassword: ''
        }));
        setConfirmPasswordError("Passwords don't match.")
      }
      else setConfirmPasswordError("")
    }
    else setConfirmPasswordError("")
  }

  // handle submission
  const [error, setError] = useState(null);
  const [missingField, setMissingField] = useState(null);
  const [formData, setFormData] = useState({
    FullName: '',
    Username: '',
    PhoneNumber: '',
    Password: '',
    ConfirmedPassword: '',
    Role: manager ? "Manager" : "User"
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  function handleSubmit(e) {
    e.preventDefault();
    if (formData.FullName && formData.Username && formData.PhoneNumber && formData.Password && formData.ConfirmedPassword) {
      addNewUser(formData);
      setFormData({
        FullName: '',
        Username: '',
        PhoneNumber: '',
        Password: '',
        ConfirmedPassword: '',
        Role: "User"
      });
    }
    else {
      if (!formData.FullName || !formData.Username || !formData.PhoneNumber || !formData.Password || !formData.ConfirmedPassword) setMissingField(true)
    }
  }
  async function addNewUser(formData) {
    const url = "http://localhost/SharingPlatform/api.php/Users";
    const requestData = formData
    try {
      setError(false)
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error("SignUp Failed");
      const data = await response.json();
      if (data) {
        console.log("REACHED")
        if (manager) {
          navigate("/Homepage")
        }
        else {
          navigate("/Login")
        }
        setError(false);
      }
    } catch (err) {
      console.log("SignUp Failed");
    }
  }

  // handle reset
  function handleReset() {
    setMissingField(0)
    setUsernameError(0)
    setPasswordError(0)
    setConfirmPasswordError(0)
    setFormData(
      {
        FullName: '',
        Username: '',
        PhoneNumber: '',
        Password: '',
        ConfirmedPassword: '',
        Role: 'User'
      }
    )
  }

  return (

    <form onSubmit={handleSubmit} onReset={handleReset} className={styles.form}>

      <div className={styles.headerContainer}>
        <h2>Create New Account</h2>
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="name">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          className={`${styles.input}`}
          name="FullName"
          value={formData.FullName}
          onChange={handleChange} />
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="username">
          Username
        </label>
        <input
          onBlur={handleUsernameBlur}
          name="Username"
          value={formData.Username}
          onChange={handleChange}
          type="text" id="username"
          className={`${styles.input} ${usernameError ? styles.inputError : null}`}
        />
        {usernameError ? <div style={{ color: 'red' }}>{usernameError}</div> : null}
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="number">
          Phone Number
        </label>
        <input
          type="number"
          name="PhoneNumber"
          value={formData.PhoneNumber}
          onChange={handleChange}
          id="number"
          className={`${styles.input}`}
        />
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          onBlur={handlePasswordBlur}
          name="Password"
          value={formData.Password}
          onChange={handleChange}
          type="password"
          id="password"
          className={`${styles.input} ${passwordError ? styles.inputError : null}`}
        />
        {passwordError ? <div style={{ color: 'red' }}>{passwordError}</div> : null}
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          onBlur={handleConfirmPasswordBlur}
          name="ConfirmedPassword"
          value={formData.ConfirmedPassword}
          onChange={handleChange}
          type="password"
          id="confirmPassword"
          className={`${styles.input} ${confirmPasswordError ? styles.inputError : null}`}
        />
        {confirmPasswordError ? <div style={{ color: 'red' }}>{confirmPasswordError}</div> : null}
      </div>

      {
        missingField ? <div style={{ color: 'red', textAlign: "start" }}>All fields are required</div> : null
      }

      <div className={styles.buttonsContainer}>
        <button className={styles.cancel} type="reset">
          Cancel
        </button>
        <button className={styles.submit} type="submit">
          Sign Up
        </button>
      </div>

    </form>
  );

}

export default SignUp;
