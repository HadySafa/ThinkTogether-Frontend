import { useState, useRef } from 'react';
import styles from './style.module.css'
import Header from '../Header'
import { IoMdSearch } from "react-icons/io";

function Search() {

    const [posts, setPosts] = useState([])
    const searchInputField = useRef(null)

    function handleSubmit() {

    }

    return (
        <>
            <Header />
            <section className={styles.mainContainer}>

                <h2><p>Search In Posts</p><IoMdSearch /></h2>

                <div className={styles.subContainer}>
                    <form className={styles.searchContainer} onSubmit={handleSubmit}>
                        <input
                            ref={searchInputField}
                            placeholder='keyword to search about'
                            className={styles.input}
                        />
                        <button className={styles.button} type='submit'>Search</button>
                    </form>


                    {
                        posts && posts.length > 0
                            ?
                            <div className={styles.postsContainer}></div>
                            : "cdcc"
                    }
                </div>

            </section >
        </>
    )

}

export default Search