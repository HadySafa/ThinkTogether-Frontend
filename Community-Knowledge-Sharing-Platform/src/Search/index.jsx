import { useState, useRef, useContext, useEffect } from 'react';
import styles from './style.module.css'
import { useNavigate } from "react-router-dom";
import Header from '../Header'
import Post from '../Post'
import { IoMdSearch } from "react-icons/io";
import MyContext from '../Context';

function Search() {

    // note: handle loading and error states

    const navigate = useNavigate();

    const [posts, setPosts] = useState([])
    const [error, setError] = useState("")
    const searchInputField = useRef(null)
    const [loading, setLoading] = useState(false);

    const { token } = useContext(MyContext);
    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token]);

    // get posts based on search
    async function handleSubmit(e) {
        setError("")
        setPosts([])
        e.preventDefault();
        const searchParameter = searchInputField.current.value;
        if (searchParameter) {
            const url = "http://localhost:8000/api/posts?search=" + searchParameter;
            try {
                setLoading(true);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer' + token
                    }
                });
                if (!response.ok) throw new Error("Response Failed");
                const data = await response.json()
                if (data) {
                    setLoading(false);

                    setPosts(data.posts)
                }
            }
            catch (error) {
                setPosts([])
                setLoading(false);
                setError(error.message)
            }
        }
    }

    return (
        <>
            <Header searchActive={true} />

            <section className={styles.mainContainer}>

                <h2><p>Search In Tags</p><IoMdSearch /></h2>

                <div className={styles.subContainer}>

                    <form className={styles.searchContainer} onSubmit={handleSubmit}>
                        <input
                            ref={searchInputField}
                            placeholder='Enter a Keyword'
                            className={styles.input}
                            type='text'
                        />
                        <button className={styles.button} type='submit'>Search</button>
                    </form>

                    {loading ? (
                        <div className={styles.spinner}></div>
                    ) : error ? (
                        <div>{error}</div>
                    ) : posts && posts.length > 0 ? (
                        <section className={styles.postsContainer}>
                            {posts.map((obj, index) => (
                                <Post key={index} postData={obj} />
                            ))}
                        </section>
                    ) : (
                        <div>No search results found.</div>
                    )}


                </div>

            </section >

        </>
    )

}

export default Search