import { useState, useRef } from 'react';
import styles from './style.module.css'
import Header from '../Header'
import Post from '../Post'
import { IoMdSearch } from "react-icons/io";

function Search() {

    const [posts, setPosts] = useState([])
    const [error, setError] = useState("")
    const searchInputField = useRef(null)

    // get posts based on search
    async function handleSubmit(e) {
        setError("")
        e.preventDefault();
        const searchParameter = searchInputField.current.value;
        const url = "http://localhost/SharingPlatform/api.php/Posts/Search/" + searchParameter;
        try {
            const response = await fetch(url)
            if (!response.ok) throw new Error("Response Failed");
            const data = await response.json()
            if (data) {
                setPosts(data)
            }
        }
        catch (error) {
            setPosts([])
            console.log(error.message)
            setError("No search results found for " + searchParameter)
        }
    }

    return (
        <>
            <Header searchActive={true} />
            <section className={styles.mainContainer}>

                <h2><p>Search In Posts</p><IoMdSearch /></h2>

                <div className={styles.subContainer}>
                    <form className={styles.searchContainer} onSubmit={handleSubmit}>
                        <input
                            ref={searchInputField}
                            placeholder='Enter a Keyword'
                            className={styles.input}
                        />
                        <button className={styles.button} type='submit'>Search</button>
                    </form>


                    {
                        posts && posts.length > 0
                            ?
                            <div className={styles.postsContainer}>{posts.map((obj, index) => <Post key={index} postData={obj} />)}</div>
                            : error ? <div>{error}</div> : null
                    }
                </div>

            </section >
        </>
    )

}

export default Search