import styles from "./style.module.css";
import { useState,useEffect,useRef } from "react";

function Login() {

      const [responseData, setResponseData] = useState(null);
      const [error, setError] = useState(null);
      
      const form = useRef(null);



      async function verifyLogin() {
        const url = "http://localhost/SharingPlatform/api.php/Users/Login";

        const requestData = {
          Password: "123456",
          Username: "hadi123",
        };

        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) throw new Error("Network response was not ok");

          const data = await response.json();

          setResponseData(data);
        } catch (err) {
          setError(err.message);
        }
        
      }

      useEffect(() => {

        function handleSubmission(e){
          e.preventDefault();
          verifyLogin();
        }
    
        form.current.addEventListener('submit', handleSubmission);
    
        return () => {
          form.current.removeEventListener('submit', handleSubmission);
        };

      }, []); 

      useEffect(() => {
        console.log(responseData)
      },[responseData,error])



      return (
        <form ref={form} className={styles.form}>
          <h2>Login</h2>

          <div className={styles.container}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input type="text" id="username" className={styles.input} />
          </div>

          <div className={styles.container}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input type="password" id="password" className={styles.input} />
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
