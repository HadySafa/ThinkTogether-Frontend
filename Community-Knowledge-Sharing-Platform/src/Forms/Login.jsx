import styles from "./style.module.css";
import { useState, useRef, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import MyContext from "../Context";

function Login() {

  // note: handle loading state

  const usernameField = useRef(null);
  const passwordField = useRef(null);
  const navigate = useNavigate();
  const { setToken } = useContext(MyContext);

  const [usernameMissing, setUsernameMissing] = useState(null);
  const [passwordMissing, setPasswordMissing] = useState(null);
  const [error, setError] = useState(null);

  // form validation
  function handleBlur(caller) {
    if (caller == "username" && usernameField.current.value) {
      setUsernameMissing(false);
      setError(false)
    }
    if (caller == "password" && passwordField.current.value) {
      setPasswordMissing(false);
      setError(false)
    }
  }

  function handleSubmission(e) {

    e.preventDefault();

    const username = usernameField.current.value;
    const password = passwordField.current.value;

    if (!username) setUsernameMissing(true)
    if (!password) setPasswordMissing(true)

    if (username && password) {
      verifyLogin(username, password);
      setUsernameMissing(false)
      setPasswordMissing(false)
    }

  }

  async function verifyLogin(username, password) {
    const url = "http://localhost:8000/api/login";
    const requestData = {
      username: username,
      password: password,
    };
    try {
      setError(false)
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error("Login Failed");
      const data = await response.json();
      if (data) {
        setToken(data.token)
        navigate('/Homepage')
        setError(false);
      }
    } catch (err) {
      usernameField.current.value = "";
      passwordField.current.value = "";
      setError("Login Failed");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmission} className={styles.form}>

        <div className={styles.headerContainer}>
          <h2>Login</h2>
        </div>

        <div className={styles.container}>
          <label className={styles.label} htmlFor="username">
            Username
          </label>
          <input
            ref={usernameField}
            onBlur={() => handleBlur("username")}
            type="text"
            id="username"
            className={`${styles.input} ${error || usernameMissing ? styles.inputError : null}`}
          />
        </div>

        <div className={styles.container}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            ref={passwordField}
            onBlur={() => handleBlur("password")}
            type="password"
            id="password"
            className={`${styles.input} ${error || passwordMissing ? styles.inputError : null}`}
          />
        </div>

        <div className={styles.buttonsContainer}>
          <button className={styles.cancel} type="reset">
            Cancel
          </button>
          <button className={styles.submit} type="submit">
            Login
          </button>
        </div>

        <div className={styles.link}><p>Don't have an account?</p> <Link to="/SignUp">Create Account</Link></div>

      </form>

    </>
  );

}

export default Login;
