import { useEffect, useState, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context';
import Post from '../Post'
import styles from './style.module.css'
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import user from '../assets/user.png'
import Header from '../Header';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

function Homepage() {

  // note: handle loading and error states

  const navigate = useNavigate(null)

  // redirect if not logged in
  const { categories, token, username } = useContext(MyContext);
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token]);

  // function to shuffle array elements
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // show all posts
  const [posts, setPosts] = useState([])
  async function getAllPosts() {
    const url = "http://localhost:8000/api/posts";
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer' + token
        }
      });

      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      if (data) {
        setPosts(shuffleArray(data.posts));
      }
      Fff
    } catch (error) {
      //
    }
  }

  useEffect(() => { getAllPosts(); }, [])


  // link to profile page
  function toProfile() {
    navigate("/Profile")
  }


  // filter
  const dropdown = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCategoryName, setSelectedCategoryName] = useState("")
  function filterOption() {
    let submitttedOption = dropdown.current.value;
    if (submitttedOption) {
      if (submitttedOption == "category" && selectedCategory) getPostsByCategories(selectedCategory)
      else if (submitttedOption == "top") getTopPosts();
    }
    else {
      getAllPosts();
    }
  }

  // top posts 
  async function getTopPosts() {
    const url = "http://localhost:8000/api/posts/top";
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer' + token
        }
      });
      if (!response.ok) throw new Error("");
      const data = await response.json()
      if (data) {
        setPosts(data.posts)
      }
    }
    catch (error) {
      //
    }
  }

  // filter by categories
  async function getPostsByCategories(selectedCategory) {
    const url = "http://localhost:8000/api/category/" + selectedCategory + "/posts";
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer' + token
        }
      });
      if (!response.ok) throw new Error("Failed")
      const data = await response.json()
      if (data) setPosts(data.posts)
    }
    catch (err) {
      // handle error
    }
  }
  function chooseCategory(id, name) {
    setSelectedCategory(id)
    setSelectedCategoryName(name)
  }

  // pagination logic
  const [currentPage, setCurrentPage] = useState(1)
  let postsPerPage = 3;
  let nbOfPages = Math.ceil(posts.length / postsPerPage)
  let firstIndex = (currentPage - 1) * postsPerPage;
  let lastIndex = currentPage == nbOfPages ? posts.length : firstIndex + 3
  function nextPage() {
    if (currentPage < nbOfPages) {
      setCurrentPage((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }
  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  return (
    <>
      <Header homeActive={true} />

      <section className={styles.mainContainer}>

        <section className={styles.firstContainer}>

          <div className={styles.userInfoContainer}>
            <div>
              <div className={styles.userImageContainer}><img src={user} alt="User Logo" /></div>
              <p>Logged in as <span className={styles.highlight}>{username}</span></p>
            </div>
            <p onClick={toProfile} className={styles.toProfile}>Manage Profile <span><MdOutlineKeyboardDoubleArrowRight /></span></p>
          </div>

          <div className={styles.filterContainer}>
            <h4>
              <p>Filter By</p>
              <select ref={dropdown}><option value="">Nothing</option>
                <option value="top">Top</option>
                <option value="category">Category</option>
              </select>
              <button className={styles.button} onClick={filterOption}>Apply</button>
            </h4>
            <div className={styles.subContainer}>
              <p>Selected Category: {selectedCategoryName ? selectedCategoryName : "none"}</p>
              {
                categories && categories.length > 0
                  ? <div className={styles.categoriesContainer}>
                    {categories.map((obj, index) => <p key={index} onClick={() => chooseCategory(obj.id, obj.name)}>{obj.name}</p>)}
                  </div>
                  : null
              }
            </div>
          </div>

        </section>

        <section className={styles.postsContainer}>
          {/*for posts*/}
          {
            posts && posts.length > 0
              ? //shuffleArray(posts).map( (obj,index) => id == obj.UserId ? null : <Post key={index} postData={obj} />)
              posts.slice(firstIndex, lastIndex).map((obj, index) => <Post key={index} postData={obj} />)
              : "No posts found"
          }

          {/*for pagination*/}
          {
            posts && posts.length > 0
              ?
              <div className={styles.paginationContainer}>
                <div onClick={prevPage}><MdKeyboardArrowLeft /></div>
                <div>{currentPage} / {nbOfPages}</div>
                <div onClick={nextPage}><MdKeyboardArrowRight /></div>
              </div>
              : null
          }
        </section>

      </section >
    </>
  );

}

export default Homepage