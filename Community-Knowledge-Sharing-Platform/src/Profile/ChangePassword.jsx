import styles from './style.module.css'
import { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context';
import { FaPen } from "react-icons/fa";

function ChangePassword() {

    // note: handle loading and error states

    const { token, username } = useContext(MyContext);
    const navigate = useNavigate(null)
    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token]);

    // define refs and states
    const oldPassword = useRef(null)
    const newPassword = useRef(null)
    const confirmNewPassword = useRef(null)
    const form = useRef(null)
    const [oldPasswordError, setOldPasswordError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")

    // handling old password
    async function handleOldPasswordBlur() {
        let submittedOldPassword = oldPassword.current.value;
        if (submittedOldPassword.length > 0) {
            if (submittedOldPassword.length == 8) {
                let result = await verifyLogin(username, submittedOldPassword)
                if (!result) {
                    setOldPasswordError("Incorrect password.")
                    form.current.reset()
                }
                else {
                    setOldPasswordError("")
                }
            }
            else {
                setOldPasswordError("Password must be 8 characters.")
            }
        }
        else {
            setOldPasswordError("")
        }
    }
    async function verifyLogin(username, password) {
        const url = "http://localhost:8000/api/login";
        const requestData = {
            username: username,
            password: password,
        };
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer" + token
                },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) throw new Error("Login Failed");
            const data = await response.json();
            if (data.token) {
                return true
            }
            else {
                return false
            }
        } catch (err) {
            // 
        }
    }

    // handle new password submission
    function handlePasswordBlur() {
        let submittedPassword = newPassword.current.value;
        if (submittedPassword && submittedPassword.length > 0) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(submittedPassword)) setPasswordError('Password must be at least 8 characters, containing a number, lowercase and uppercase characters.');
            else setPasswordError('');
        }
        else setPasswordError('');
    }
    function handleConfirmPasswordBlur() {
        let submittedPassword = newPassword.current.value;
        let submittedConfirmPassword = confirmNewPassword.current.value;
        if (submittedConfirmPassword && submittedPassword) {
            if (submittedConfirmPassword !== submittedPassword) {
                setConfirmPasswordError("Passwords don't match.")
            }
            else setConfirmPasswordError("")
        }
        else setConfirmPasswordError("")
    }
    async function handleUpdate(e) {
        e.preventDefault();

        const oldPass = oldPassword.current.value;
        const newPass = newPassword.current.value;
        const confirmPass = confirmNewPassword.current.value;

        if (newPass && newPass === confirmPass) {
            const url = "http://localhost:8000/api/update-password";
            const requestData = {
                current_password: oldPass,
                new_password: newPass,
                new_password_confirmation: confirmPass
            };

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer' + token
                    },
                    body: JSON.stringify(requestData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log("Error:", errorData);
                    throw new Error("Edit Failed");
                }

                navigate("/");

            } catch (err) {
                // 
            }
        }
    }


    return (
        <section className={styles.changePassContainer}>

            <h2><p>Change Password</p><FaPen /></h2>

            <form ref={form} className={styles.form} onSubmit={handleUpdate}>

                <div>
                    <label htmlFor="oldPass">
                        Old Password
                    </label>
                    <input
                        id='oldPass'
                        onBlur={handleOldPasswordBlur}
                        ref={oldPassword}
                        type="password"
                        placeholder='********'
                        className={`${styles.input}`}
                    />
                    {oldPasswordError ? <div style={{ color: 'red' }}>{oldPasswordError}</div> : null}
                </div>

                <div>
                    <label htmlFor="password">
                        New Password
                    </label>
                    <input
                        id='password'
                        onBlur={handlePasswordBlur}
                        ref={newPassword}
                        type="password"
                        placeholder='********'
                        className={`${styles.input}`}
                    />
                    {passwordError ? <div style={{ color: 'red' }}>{passwordError}</div> : null}
                </div>

                <div className={styles.container}>
                    <label htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <input
                        id='confirmPassword'
                        onBlur={handleConfirmPasswordBlur}
                        placeholder='********'
                        ref={confirmNewPassword}
                        type="password"
                        className={`${styles.input}`}
                    />
                    {confirmPasswordError ? <div style={{ color: 'red' }}>{confirmPasswordError}</div> : null}
                </div>

                <div className={styles.buttonsContainer}>
                    <button type='reset'>Cancel</button><button type='submit'>Submit</button>
                </div>

            </form>

        </section>
    )

}

export default ChangePassword