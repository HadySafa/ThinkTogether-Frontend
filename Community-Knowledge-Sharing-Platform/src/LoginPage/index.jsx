import styles from "./style.module.css";
import { useState, useEffect, useRef } from "react";
import { CiLogin } from "react-icons/ci";

function Login() {

  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const [usernameMissing, setUsernameMissing] = useState(null);
  const [passwordMissing, setPasswordMissing] = useState(null);

  const usernameField = useRef(null);
  const passwordField = useRef(null);

  async function verifyLogin(username, password) {
    const url = "http://localhost/SharingPlatform/api.php/Users/Login";
    const requestData = {
      Username: username,
      Password: password,
    };
    try {
      setError(false)
      setResponseData("")
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) throw new Error("Login Failed");
      const data = await response.json();
      if (data) {
        setResponseData(data.message);
        sessionStorage.setItem("token", data.token);
        setError(false);
      }
    } catch (err) {
      setResponseData("");
      setError("Login Failed");
    }
  }

  function handleSubmission(e) {
    e.preventDefault();
    const username = usernameField.current.value;
    const password = passwordField.current.value;
    if(!username) setUsernameMissing(true)
    if(!password) setPasswordMissing(true)
    if(username && password) {
      verifyLogin(username, password);
      setUsernameMissing(false)
      setPasswordMissing(false)
    }
  }

  useEffect(() => {
    if (error) {
      usernameField.current.value = "";
      passwordField.current.value = "";
    }
  }, [responseData,error]);

  return (
    <form onSubmit={handleSubmission} className={styles.form}>
      <div>
        <CiLogin className={styles.image} />
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="username">
          Username
        </label>
        <input
          ref={usernameField}
          type="text"
          id="username"
          className={`${styles.input} ${usernameMissing ? styles.inputError : null}`}
        />
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          ref={passwordField}
          type="password"
          id="password"
          className={`${styles.input} ${passwordMissing ? styles.inputError : null}`}
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
    </form>
  );
}

export default Login;
