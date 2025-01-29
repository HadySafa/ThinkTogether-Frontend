import styles from './style.module.css'
import { RxHamburgerMenu } from "react-icons/rx";
import { useState, useContext, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
import { FaPen } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context';
import logo from '../assets/logo.png'

function Header({homeActive,profileActive,makePostActive,searchActive}) {

    const navigate = useNavigate(null)
    const { setToken } = useContext(MyContext);
    const [showNav, setShowNav] = useState(false)

    // handle actions
    function toggleNav() {
        if (showNav) {
            setShowNav(false)
        }
        else {
            setShowNav(true)
        }
    }
    function handleHome() {
        navigate("/Homepage")
    }
    function handleNewPost() {
        navigate("/NewPost")
    }
    function handleProfile() {
        navigate("/Profile")
    }
    function handleLogout() {
        setToken("")
        navigate("/Login")
    }
    function handleSearch(){
        navigate("/Search")
    }

    // handle screen resize for layout purposes
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 900);
    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 900);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        if(isWideScreen) setShowNav(false)
    }, [isWideScreen]);


    return (
        <header className={styles.header}>

            <div className={styles.logoContainer}>
                <img src={logo} alt='Logo' className={styles.logo} />
                <h2>Think Together</h2>
            </div>

            <div>
                {
                    !isWideScreen
                    ? <div className={styles.icons}>{showNav ? <IoClose onClick={toggleNav} /> : <RxHamburgerMenu onClick={toggleNav} />}</div>
                    : <nav className={styles.horizantalNav}>
                            <div className={homeActive ? styles.active : null} title='Home' onClick={handleHome}><IoHomeSharp /></div>
                            <div className={searchActive ? styles.active : null} onClick={handleSearch} title='Search'><FaSearch /></div>
                            <div className={makePostActive ? styles.active : null} title='New post' onClick={handleNewPost}><FaPen /></div>
                            <div className={profileActive ? styles.active : null} title='Profile' onClick={handleProfile}><FaUser /></div>
                            <div className={styles.button} onClick={handleLogout}>Logout</div>
                      </nav>
                }
            </div>

            <nav className={`${styles.nav} ${showNav ? styles.visibile : null}`}>
                <div onClick={handleHome}><IoHomeSharp /><span>Home</span></div>
                <div onClick={handleSearch}><FaSearch /><p>Search</p></div>
                <div onClick={handleNewPost}><FaPen /><span>New Post</span></div>
                <div onClick={handleProfile}><FaUser /><span>Profile</span></div>
                <div onClick={handleLogout}><TbLogout2 /><span>Logout</span></div>
            </nav>

        </header>
    )

}

export default Header