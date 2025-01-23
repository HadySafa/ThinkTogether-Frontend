//import styles from './style.module.css'
import { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context';
import Post from '../Post'
import styles from './style.module.css'

function Homepage() {

  const { id, token } = useContext(MyContext);
  const navigate = useNavigate(null)
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  const [posts, setPosts] = useState([])
  async function getAllPosts() {
    const url = "http://localhost/SharingPlatform/api.php/Posts";
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error("");
      const data = await response.json()
      if (data) {
        setPosts(data)
      }
    }
    catch (error) {
      //setError(error.message)
    }
  }
  useEffect(() => {
    getAllPosts();
  }, [])


  return (
    <div className={styles.mainContainer}>
      <div className={styles.firstContainer}>
            <p>Some other content</p>
      </div>
      <div className={styles.postsContainer}>
        {
          posts
            ? //posts.map( (obj,index) => {id == obj.UserId ? null : <Post key={index} postData={obj} />})
            posts.map((obj, index) => <Post key={index} postData={obj} />)
            : null
        }
      </div>
    </div>
  );

}

export default Homepage