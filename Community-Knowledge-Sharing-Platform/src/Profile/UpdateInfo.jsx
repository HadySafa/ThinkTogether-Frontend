import { FaPen } from "react-icons/fa";
import MyContext from '../Context';
import styles from './style.module.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useContext } from 'react'

function UpdateInfo() {

    // give access
    const { token, setToken, id, fullName, number } = useContext(MyContext);
    const navigate = useNavigate(null)
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token]);

    // autofill the fields
    const nameField = useRef(null)
    const numberField = useRef(null)
    const form = useRef(null)
    useEffect(() => {
        nameField.current.value = fullName
        numberField.current.value = number
    }, [])

    // handle submission
    async function handleUpdate(e) {
        e.preventDefault();
        let submittedName = nameField.current.value
        let submittedNumber = numberField.current.value
        if (submittedName || submittedNumber) {
            const url = "http://localhost/SharingPlatform/api.php/Users/" + id;
            const requestData = {
                FullName: submittedName ? submittedName : fullName,
                PhoneNumber: submittedNumber ? submittedNumber : number
            }
            try {
                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestData),
                });
                if (!response.ok) throw new Error("Edit Failed");
                const data = await response.json()
                if (data) {
                    setToken(data.token)
                    navigate("/Profile")
                }
            } catch (err) {
                console.log("ERROR HERE: " + err);
            }
        }
    }



    return (
        <section className={styles.updateInfoContainer}>
            <h2><p>Update Profile</p><FaPen /></h2>
            <form ref={form} className={styles.form} onSubmit={handleUpdate}>
                <div>
                    <h3>Full Name</h3>
                    <input ref={nameField} className={styles.input} type='text' />
                </div>
                <div>
                    <h3>Phone Number</h3>
                    <input ref={numberField} className={styles.input} type='number' />
                </div>
                <div className={styles.buttonsContainer}>
                    <button type='reset'>Cancel</button><button type='submit'>Submit</button>
                </div>
            </form>
        </section>
    )

}

export default UpdateInfo