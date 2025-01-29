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

  const navigate = useNavigate(null)

  // redirect if not logged in
  const { id, token, username } = useContext(MyContext);
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  // function to shuffle array elements
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements at i and j
    }
    return arr;
  }

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
    navigate("/Profile")
  }

  // get categories
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
      console.log(error.message)
    }
  }
  useEffect(() => { getAllCategories() }, [])


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
    const url = "http://localhost/SharingPlatform/api.php/Posts/Top";
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

  // filter by categories
  async function getPostsByCategories(selectedCategory) {
    const url = 'http://localhost/SharingPlatform/api.php/Posts/Category/' + selectedCategory;
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed")
      const data = await response.json()
      if (data) setPosts(data)
    }
    catch (err) {
      console.log(err.message)
    }
  }
  function chooseCategory(id, name) {
    setSelectedCategory(id)
    setSelectedCategoryName(name)
  }

  // pagination logic
  const [currentPage,setCurrentPage] = useState(1)
  let postsPerPage = 3;
  let nbOfPages = Math.ceil(posts.length / postsPerPage)
  let firstIndex = (currentPage - 1) * postsPerPage;
  let lastIndex = currentPage == nbOfPages ? posts.length : firstIndex + 3
  function nextPage(){
    if(currentPage < nbOfPages) {
      setCurrentPage( (prev) => prev + 1)
      window.scrollTo(0,0)
    }
  }
  function prevPage(){
    if(currentPage > 1) {
      setCurrentPage( (prev) => prev - 1)
      window.scrollTo(0,0)
    }
  }


  return (
    <>
      <Header homeActive={true} />
      <div className={styles.mainContainer}>

        <div className={styles.firstContainer}>

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
                    {categories.map((obj, index) => <p key={index} onClick={() => chooseCategory(obj.Id, obj.Name)}>{obj.Name}</p>)}
                  </div>
                  : null
              }
            </div>
          </div>

        </div>

        <div className={styles.postsContainer}>
          {
            posts && posts.length > 0
              ? //shuffleArray(posts).map( (obj,index) => id == obj.UserId ? null : <Post key={index} postData={obj} />)
              dropdown.current.value ? posts.slice(firstIndex,lastIndex).map((obj, index) => <Post key={index} postData={obj} />) : shuffleArray(posts).slice(firstIndex,lastIndex).map((obj, index) => <Post key={index} postData={obj} />)
              : "No posts found"
          }
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
        </div>

      </div >
    </>
  );

}

export default Homepage