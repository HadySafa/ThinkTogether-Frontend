import styles from './style.module.css'
import { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context';
import { FaPen } from "react-icons/fa6";
import { useLocation } from 'react-router-dom';

function EditPost() {

    const { id, token } = useContext(MyContext);
    const navigate = useNavigate(null)
    const location = useLocation();
    const data = location.state;
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        if (!data) {
            navigate('/profile');
        }
    }, [token]);

    const form = useRef(null)
    const title = useRef(null)
    const description = useRef(null)
    const link = useRef(null)
    const code = useRef(null)
    useEffect(() => {
        if (data) {
            title.current.value = data.PostTitle;
            description.current.value = data.PostDescription;
            link.current.value = data.PostLink;
            code.current.value = data.PostCode;
        }
    }, [data])



    // handle submission
    async function handleSubmission(e) {
        e.preventDefault();

        let submittedTitle = title.current.value;
        let submittedDescription = description.current.value;
        let submittedLink = link.current.value ? link.current.value : "";
        let submittedCode = code.current.value ? code.current.value : "";

        const postData = {
            Title: submittedTitle,
            Description: submittedDescription,
            Link: submittedLink,
            CodeSnippet: submittedCode,
            UserId: id
        }

        if (postData.Title && postData.Description && postData.UserId) {
            let result = await editPost(postData);
            if (result) {
                navigate("/Profile")
            }
            form.current.reset();
        }
    }
    async function editPost(formData) {
        const url = "http://localhost/SharingPlatform/api.php/Posts/" + data.PostID;
        const requestData = formData
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) throw new Error("Edit Failed");
            return true
        } catch (err) {
            console.log("ERROR HERE: " + err);
        }
    }

    return (

        <form ref={form} className={styles.form} method='post' onSubmit={handleSubmission}>

            <h2 className={styles.header}><FaPen className={styles.icon} />Edit Post</h2>

            <div>
                <div className={styles.title}>Title</div>
                <input
                    type='text'
                    ref={title}
                    name='Title'
                    placeholder='Edited title here'
                    className={styles.titleInput}
                />
            </div>

            <div>
                <div className={styles.title}>Description</div>
                <textarea
                    type='textarea'
                    ref={description}
                    name='Description'
                    placeholder='Edited description here'
                    className={styles.descriptionInput}
                ></textarea>
            </div>


            <div>
                <div className={styles.title}>Link</div>
                <input
                    type='text'
                    ref={link}
                    name='Link'
                    placeholder='Edited link here'
                    className={styles.titleInput}
                />
            </div>

            <div>
                <div className={styles.title}>Code Snippet</div>
                <textarea
                    type='textarea'
                    ref={code}
                    name='code'
                    placeholder='Edited code snippet here'
                    className={styles.descriptionInput}
                ></textarea>
            </div>

            <div className={styles.buttonsContainer}>
                <button type='reset' className={styles.cancel}>Cancel</button>
                <button type='submit' className={styles.submit}>Submit</button>
            </div>

        </form>

    )

}

export default EditPost;