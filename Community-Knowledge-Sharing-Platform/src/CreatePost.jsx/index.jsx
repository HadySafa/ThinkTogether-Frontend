import styles from './style.module.css'
import { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context';
import { FaPen } from "react-icons/fa6";

function CreatePost() {

    const { id, token } = useContext(MyContext);
    const navigate = useNavigate(null)

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token]);


    const form = useRef(null)
    const title = useRef(null)
    const description = useRef(null)
    const category = useRef(null)
    const link = useRef(null)
    const code = useRef(null)
    const tags = useRef(null)

    // fill dropdown
    const [categories, setCategories] = useState([])
    async function getAllCategories() {
        const url = "http://localhost/SharingPlatform/api.php/Categories";
        try {
            const response = await fetch(url)
            if (!response.ok) throw new Error("");
            const data = await response.json()
            if (data) {
                setCategories(data)
            }
        }
        catch (error) {
            setError(error.message)
        }
    }
    useEffect(() => { getAllCategories() }, [])

    // handle submission
    async function handleSubmission(e) {
        e.preventDefault();

        let submittedTitle = title.current.value;
        let submittedDescription = description.current.value;
        let submittedCategory = category.current.value;
        let submittedLink = link.current.value ? link.current.value : "";
        let submittedCode = code.current.value ? code.current.value : "";
        let submittedTags = tags.current.value.split(",");

        const postData = {
            Title: submittedTitle,
            Description: submittedDescription,
            CategoryId: submittedCategory,
            Link: submittedLink,
            CodeSnippet: submittedCode,
            UserId: id
        }

        if (postData.Title && postData.Description && postData.CategoryId && postData.UserId) {
            let result = await addNewPost(postData);
            if (result) {
                
                for(let i = 0; i < submittedTags.length; i++){
                    addNewTag(submittedTags[i],result)
                }
                
                navigate("/Home")
            }
            form.current.reset();
        }
    }
    async function addNewPost(formData) {
        const url = "http://localhost/SharingPlatform/api.php/Posts";
        const requestData = formData
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) throw new Error("Creation Failed");
            const data = await response.json();
            if (data) {
                return data.postId
            };

        } catch (err) {
            console.log("ERROR HERE: " + err);
        }
    }
    async function addNewTag(tagName, postId) {
        const object = {
            Name: tagName,
            PostId: postId
        }
        const url = "http://localhost/SharingPlatform/api.php/Posts/Tags";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(object),
            });
            if (response.ok){
                return true;
            }
            else{
                throw new Error("Creation Failed")
            }
        } catch (err) {
            console.log("ERROR HERE: " + err);
        }
    }



    return (

        <form ref={form} className={styles.form} method='post' onSubmit={handleSubmission}>

            <h2 className={styles.header}><FaPen className={styles.icon}/>Create Post </h2>

            <div>
                <div className={styles.title}>Title <span className={styles.optional}    >(Required)</span></div>
                <input
                    type='text'
                    ref={title}
                    name='Title'
                    placeholder='Enter a title for your post'
                    className={styles.titleInput}
                />
            </div>

            <div>
                <div className={styles.title}>Description <span className={styles.optional}    >(Required)</span></div>
                <textarea
                    type='textarea'
                    ref={description}
                    name='Description'
                    placeholder='Enter your post description here'
                    className={styles.descriptionInput}
                ></textarea>
            </div>

            <div>
                <div className={styles.title}>Category <span className={styles.optional}    >(Required)</span></div>
                <div className={styles.dropdownContainer}>
                    <select name='Category' ref={category} className={styles.dropdown}>
                        <option value="">Choose Category</option>
                        {
                            categories && categories.length > 0
                                ? categories.map((object, index) => <option key={index} value={object.Id}>{object.Name}</option>)
                                : null
                        }
                    </select>
                </div>
            </div>

            <div>
                <div className={styles.title}>Tags<span className={styles.optional}> (Optional)</span></div>
                <input
                    type='text'
                    ref={tags}
                    name='Tags'
                    placeholder='Add tags seperated by a comma ","'
                    className={styles.titleInput}
                />
            </div>

            <div>
                <div className={styles.title}>Link <span className={styles.optional}>(Optional)</span></div>
                <input
                    type='text'
                    ref={link}
                    name='Link'
                    placeholder='Attach a link'
                    className={styles.titleInput}
                />
            </div>

            <div>
                <div className={styles.title}>Code Snippet <span className={styles.optional}    >(Optional)</span></div>
                <textarea
                    type='textarea'
                    ref={code}
                    name='code'
                    placeholder='Attach a code snippet'
                    className={styles.descriptionInput}
                ></textarea>
            </div>

            <div className={styles.buttonsContainer}>
                <button type='reset' className={styles.cancel}>Cancel</button>
                <button type='submit' className={styles.submit}>Post</button>
            </div>

        </form>

    )

}

export default CreatePost;