import styles from "./style.module.css";
import { useState, useEffect, useRef } from "react";

function SignUp() {

  const [passwordError, setPasswordError] = useState('');
  const password = useRef(null);

  function handleChange() {
    console.log("Changes occured");
  }

  function handleSubmit() {
    console.log("Submission occured");
  }

  const handlePasswordBlur = () => {
    const submittedPassword = password.current.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(submittedPassword)) {
        setPasswordError('Password must contain at least one number, one lowercase letter, one uppercase letter, and be at least 8 characters long.');
    } else {
        setPasswordError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>SignUp</h2>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="name">
          Full Name
        </label>
        <input type="text" id="name" className={styles.input} />
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="username">
          Username
        </label>
        <input type="text" id="username" className={styles.input} />
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="number">
          Phone Number
        </label>
        <input type="number" id="number" className={styles.input} />
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input onBlur={handlePasswordBlur} ref={password} type="password" id="password" className={`${styles.input} ${passwordError ? styles.inputError : null}`} />
        {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
      </div>

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
