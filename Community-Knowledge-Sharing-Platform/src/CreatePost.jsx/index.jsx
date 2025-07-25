import styles from './style.module.css'
import { useEffect, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context';
import { FaPen } from "react-icons/fa6";
import Header from '../Header';

function CreatePost() {

    // note: handle loading and error states

    const { token, categories } = useContext(MyContext);
    const navigate = useNavigate(null)

    // if not logged In, redirect
    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token]);

    const form = useRef(null)
    const title = useRef(null)
    const description = useRef(null)
    const category = useRef(null)
    const link = useRef(null)
    const code = useRef(null)
    const tags = useRef(null)

    async function handleSubmission(e) {

        e.preventDefault();

        let submittedTitle = title.current.value;
        let submittedDescription = description.current.value;
        let submittedCategory = parseInt(category.current.value); 
        let submittedLink = link.current.value || "";
        let submittedCode = code.current.value || "";
        let submittedTags = tags.current.value.split(",");

        const postData = {
            title: submittedTitle,
            description: submittedDescription,
            category_id: submittedCategory,
            link: submittedLink,
            codesnippet: submittedCode
        }

        if (postData.title && postData.description && postData.category_id) {
            let result = await addNewPost(postData);
            if (result) {
                if(submittedTags.length > 0) addNewTag(submittedTags,result)
                form.current.reset();
                navigate("/Homepage")
            }
        }

    }

    async function addNewPost(formData) {
        const url = "http://localhost:8000/api/posts";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", 'Authorization': 'Bearer' + token },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error("Creation Failed");
            const data = await response.json();
            return data.id;
        } catch (err) {
            return false;
        }
    }

    async function addNewTag(tags, postId) {
        const object = { tags: tags}
        const url = "http://localhost:8000/api/posts/" + postId + "/tags";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + token },
                body: JSON.stringify(object),
            });
            if (!response.ok) throw new Error("Creation Failed")
            return true;
        } catch (err) {
            return false;
        }
    }

    return (
        <>
            <Header makePostActive={true} />
            <form ref={form} className={styles.form} method='post' onSubmit={handleSubmission}>
                <h2 className={styles.header}>
                    <p>Create Post</p><FaPen className={styles.icon} />
                </h2>

                <div>
                    <div className={styles.title}>Title <span className={styles.optional}>(Required)</span></div>
                    <input type='text' ref={title} name='Title' placeholder='Enter a title for your post' className={styles.titleInput} />
                </div>

                <div>
                    <div className={styles.title}>Description <span className={styles.optional}>(Required)</span></div>
                    <textarea ref={description} name='Description' placeholder='Enter your post description here' className={styles.descriptionInput}></textarea>
                </div>

                <div>
                    <div className={styles.title}>Category <span className={styles.optional}>(Required)</span></div>
                    <div className={styles.dropdownContainer}>
                        <select name='Category' ref={category} className={styles.dropdown}>
                            <option value="">Choose Category</option>
                            {categories?.map((object, index) => (
                                <option key={index} value={object.id}>{object.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <div className={styles.title}>Tags<span className={styles.optional}> (Optional)</span></div>
                    <input type='text' ref={tags} name='Tags' placeholder='Add tags separated by a comma ","' className={styles.titleInput} />
                </div>

                <div>
                    <div className={styles.title}>Link <span className={styles.optional}>(Optional)</span></div>
                    <input type='text' ref={link} name='Link' placeholder='Attach a link' className={styles.titleInput} />
                </div>

                <div>
                    <div className={styles.title}>Code Snippet <span className={styles.optional}>(Optional)</span></div>
                    <textarea ref={code} name='code' placeholder='Attach a code snippet' className={styles.descriptionInput}></textarea>
                </div>

                <div className={styles.buttonsContainer}>
                    <button type='reset' className={styles.cancel}>Cancel</button>
                    <button type='submit' className={styles.submit}>Post</button>
                </div>

            </form>
        </>
    )
}

export default CreatePost;
