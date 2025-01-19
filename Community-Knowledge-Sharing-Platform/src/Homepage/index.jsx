//import styles from './style.module.css'
import { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context';

function Homepage(){

    const { id, token } = useContext(MyContext);
    const navigate = useNavigate(null)

    useEffect(() => {
        if (!token) {
          navigate('/login');
        }
      }, [token]);

      
    return (<div>Home page</div>);
    
}

export default Homepage