import styles from './style.module.css'
import { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context';
import Post from '../Post'

function Profile() {

  const { id, token } = useContext(MyContext);
  const navigate = useNavigate(null)
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  const [posts, setPosts] = useState([])
  const [refresh,setRefresh] = useState(true)
  async function getAllPosts(id) {
    const url = "http://localhost/SharingPlatform/api.php/Posts/" + id;
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
    if(id && refresh){
        getAllPosts(id);
    }
  }, [id,refresh])


  return (
    <div className={styles.postsContainer}>
      {
        posts
          ? posts.map((obj, index) => <Post key={index} postData={obj} forProfile={true} setRefresh={setRefresh} />)
          : null
      }
    </div>
  );

}

export default Profile