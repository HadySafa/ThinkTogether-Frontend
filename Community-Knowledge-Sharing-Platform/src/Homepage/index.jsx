import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context';
import Post from '../Post'
import styles from './style.module.css'
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import user from '../assets/user.png'
import Header from '../Header';

function Homepage() {

  const navigate = useNavigate(null)

  // redirect if not logged in
  const { id, token, username } = useContext(MyContext);
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  // show all posts
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

  // link to profile page
  function toProfile() {
    navigate("/profile")
  }

  return (
    <>
      <Header />
      <div className={styles.mainContainer}>

        <div className={styles.firstContainer}>
          <div className={styles.userInfoContainer}>
            <div>
              <div className={styles.userImageContainer}><img src={user} alt="User Logo" /></div>
              <p>Logged in as <span className={styles.highlight}>{username}</span></p>
            </div>
            <p onClick={toProfile} className={styles.toProfile}>Manage Profile <span><MdOutlineKeyboardDoubleArrowRight /></span></p>
          </div>
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
    </>
  );

}

export default Homepage