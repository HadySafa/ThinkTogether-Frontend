import styles from './style.module.css'
import { useEffect, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context';
import { FaPen } from "react-icons/fa6";
import { useLocation } from 'react-router-dom';

function EditPost() {

    // note: handle loading and error states

    const { token } = useContext(MyContext);
    const navigate = useNavigate(null)
    const location = useLocation();
    const data = location.state;
    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        if (!data) {
            navigate('/Profile');
        }
    }, [token]);

    const form = useRef(null)
    const title = useRef(null)
    const description = useRef(null)
    const link = useRef(null)
    const code = useRef(null)

    // fill the fields with existing data
    useEffect(() => {
        if (data) {
            title.current.value = data.title;
            description.current.value = data.description;
            link.current.value = data.link;
            code.current.value = data.codesnippet;
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
            title: submittedTitle,
            description: submittedDescription,
            link: submittedLink,
            codesnippet: submittedCode,
        }

        if (postData.title && postData.description) {
            let result = await editPost(postData);
            if (result) {
                form.current.reset();
                navigate("/Profile")
            }
        }

    }

    async function editPost(formData) {

        const url = "http://localhost:8000/api/posts/" + data.id;
        const requestData = formData

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer' + token
                },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) throw new Error("Edit Failed");
            return true
        } catch (err) {
            //
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