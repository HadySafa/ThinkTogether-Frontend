import styles from './style.module.css'
import { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context';
import Post from '../Post'
import Header from '../Header'
import { FaRegShareFromSquare } from "react-icons/fa6";

function Profile() {

  const { token, id, role, fullName, username, number } = useContext(MyContext);
  const navigate = useNavigate(null)
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  // view shared posts
  const [state, setState] = useState(false);
  const postsDiv = useRef(null);
  useEffect(() => {
    if (postsDiv.current && state) {
      postsDiv.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setState(false)
  }, [state]);
  function viewPosts() {
    setState(true)
  }

  // update personal info
  function updateInfo() {
    navigate("/UpdateInfo")
  }

  // change password
  function changePassword() {
    navigate("/ChangePassword")
  }

  // get personal posts
  const [posts, setPosts] = useState([])
  const [refresh, setRefresh] = useState(true)
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
    if (id && refresh) {
      getAllPosts(id);
    }
  }, [id, refresh])

  // add manager
  function handleAddManager() {
    navigate('/', { state: { manager: true } });
  }

  // manage categories
  function handleManageCategories() {
    navigate("/ManageCategories")
  }



  return (
    <>
      <Header profileActive={true} />
      <div className={styles.mainContainer}>

        <div className={styles.firstContainer}>
          <section className={styles.profile}>
            <h2>Personal Info</h2>
            <div className={styles.profileTableContainer}>
              <table>
                <tbody>
                  <tr>
                    <td>Username</td>
                    <td>{username}</td>
                  </tr>
                  <tr>
                    <td>Full Name</td>
                    <td>{fullName}</td>
                  </tr>
                  <tr>
                    <td>Phone Number</td>
                    <td>{number}</td>
                  </tr>
                  <tr>
                    <td>Role</td>
                    <td>{role}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section className={styles.actionButtonsContainer}>
            <button onClick={updateInfo}>Update Personal Info</button>
            <button onClick={changePassword}>Change Password</button>
            <button onClick={viewPosts}>View Shared Posts</button>
            {
              role == "Manager"
                ? <>
                  <button onClick={handleAddManager}>Add New Manager</button>
                  <button onClick={handleManageCategories}>Manage Categories</button>
                </>
                : null
            }
          </section>
        </div>

        {
          posts && posts.length > 0
            ?
            <section ref={postsDiv} className={styles.postsMainContainer}>
              <h2><p>Shared Posts</p><FaRegShareFromSquare /></h2>
              <div className={styles.postsContainer}>
                {
                  posts.map((obj, index) => <Post key={index} postData={obj} forProfile={true} setRefresh={setRefresh} />)
                }
              </div>
            </section>
            : null
        }

      </div>
    </>
  );

}

export default Profile