import styles from "./style.module.css";
import { useState } from "react";
import { SlUserFollow } from "react-icons/sl";

function SignUp() {

  // password validation
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
        setConfirmPasswordError("Passwords don't match.")
      }
      else setConfirmPasswordError("")
    }
    else setConfirmPasswordError("")
  }

  // username validation
  const [usernameError, setUsernameError] = useState('');
  async function getAllUsernames() {
    const url = "http://localhost/SharingPlatform/api.php/Users";
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error("");
      const data = await response.json()
      let users = []
      if (data) {
        for (let i = 0; i < data.length; i++) {
          users.push(data[i].Username)
        }
        return users
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  async function handleUsernameBlur(e) {
    const usernames = await getAllUsernames();
    let submittedUsername = e.target.value;
    let availableUsername = true;
    if (submittedUsername && submittedUsername.length > 0) {
      for (let i = 0; i < usernames.length; i++) {
        if (submittedUsername === usernames[i]) availableUsername = false
      }
      if (!availableUsername) {
        setUsernameError("Username not available, try another one.")
        e.target.value = ""
      }
      else setUsernameError('');
    }
    else setUsernameError('');
  }

  // handle submission
  const [usernameMissing, setUsernameMissing] = useState(null);
  const [passwordMissing, setPasswordMissing] = useState(null);
  const [nameMissing, setNameMissing] = useState(null);
  const [confirmPasswordMissing, setConfirmPasswordMissing] = useState(null);
  const [numberMissing, setNumberMissing] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    FullName: '',
    Username: '',
    PhoneNumber: '',
    Password: '',
    ConfirmedPassword: '',
    Role: 'User'
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
    console.log('Form submitted:', formData);
    if (formData.FullName && formData.Username && formData.PhoneNumber && formData.Password && formData.ConfirmedPassword) {
      addNewUser(formData);
      setFormData({
        FullName: '',
        Username: '',
        PhoneNumber: '',
        Password: '',
        ConfirmedPassword: '',
        Role: 'User'
      });
    }
    else{
      if(!formData.FullName) setNameMissing(true) 
      else setNameMissing(false)
      if(!formData.Username) setUsernameMissing(true)
      else setUsernameMissing(false)
      if(!formData.PhoneNumber) setNumberMissing(true)
      else setNumberMissing(false)
      if(!formData.Password) setPasswordMissing(true)
      else setPasswordMissing(false)
      if(!formData.ConfirmedPassword) setConfirmPasswordMissing(true)
      else setConfirmPasswordMissing(false)
    }


  };
  async function addNewUser(formData) {
    const url = "http://localhost/SharingPlatform/api.php/Users";
    const requestData = formData
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
      if (!response.ok) throw new Error("SignUp Failed");
      const data = await response.json();
      if (data) {
        setResponseData(data.message);
        setError(false);
      }
    } catch (err) {
      setResponseData("");
      setError("SignUp Failed");
    }
  }





  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <SlUserFollow className={styles.image} />
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="name">
          Full Name
        </label>
        <input type="text" id="name" className={`${styles.input} ${nameMissing ? styles.inputError : null}`} name="FullName" value={formData.FullName} onChange={handleChange} />
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="username">
          Username
        </label>
        <input onBlur={handleUsernameBlur} name="Username" value={formData.Username} onChange={handleChange} type="text" id="username" className={`${styles.input} ${usernameError || usernameMissing ? styles.inputError : null}`} />
        {usernameError ? <div style={{ color: 'red' }}>{usernameError}</div> : null}
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="number">
          Phone Number
        </label>
        <input type="number" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} id="number" className={`${styles.input} ${numberMissing ? styles.inputError : null}`} />
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input onBlur={handlePasswordBlur} name="Password" value={formData.Password} onChange={handleChange} type="password" id="password" className={`${styles.input} ${passwordError || passwordMissing ? styles.inputError : null}`} />
        {passwordError ? <div style={{ color: 'red' }}>{passwordError}</div> : null}
      </div>

      <div className={styles.container}>
        <label className={styles.label} htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input onBlur={handleConfirmPasswordBlur} name="ConfirmedPassword" value={formData.ConfirmedPassword} onChange={handleChange} type="password" id="confirmPassword" className={`${styles.input} ${confirmPasswordError || confirmPasswordMissing ? styles.inputError : null}`} />
        {confirmPasswordError ? <div style={{ color: 'red' }}>{confirmPasswordError}</div> : null}
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
