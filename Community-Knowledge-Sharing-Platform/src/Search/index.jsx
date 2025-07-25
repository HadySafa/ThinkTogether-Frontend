import { useState, useRef } from 'react';
import styles from './style.module.css'
import Header from '../Header'
import Post from '../Post'
import { IoMdSearch } from "react-icons/io";

function Search() {

    // note: handle loading and error states

    const [posts, setPosts] = useState([])
    const [error, setError] = useState("")
    const searchInputField = useRef(null)

    // get posts based on search
    async function handleSubmit(e) {
        setError("")
        setPosts([])
        e.preventDefault();
        const searchParameter = searchInputField.current.value;
        if (searchParameter) {
            const url = "http://localhost:8000/api/posts?search=" + searchParameter;
            try {
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
                    setPosts(data.posts)
                }
            }
            catch (error) {
                setPosts([])
                setError("No search results found for " + searchParameter)
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


                    {
                        posts && posts.length > 0
                            ?
                            <section className={styles.postsContainer}>{posts.map((obj, index) => <Post key={index} postData={obj} />)}</section>
                            : error ? <div>{error}</div> : null
                    }
                </div>

            </section >
        </>
    )

}

export default Search