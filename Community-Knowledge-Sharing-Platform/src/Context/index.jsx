import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from 'react';

const MyContext = createContext();

export const MyProvider = ({ children }) => {

  // -- Token --

  // initially, check if a token already exists
  const [token, setToken] = useState(sessionStorage.getItem('token') || '')

  // user info
  const [role, setRole] = useState("")
  const [id, setId] = useState(null)
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [number, setNumber] = useState("")

  useEffect(() => {

    sessionStorage.setItem("token", token);

    if (token) {

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // if the token has expired, delete it
      if (decodedToken.exp < currentTime) {
        setToken('');
        sessionStorage.removeItem('token');
      }
      // if it is valid, extract info
      else {
        setRole(decodedToken.role);
        setId(decodedToken.id);
        setFullName(decodedToken.fullname)
        setUsername(decodedToken.username)
        setNumber(decodedToken.phonenumber)
      }

    }

  }, [token])


  // -- Categories --

  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoriesError, setCategoriesError] = useState(false)
  const [refreshCategories, setRefreshCategories] = useState(false)

  // get categories
  async function getAllCategories() {

    const url = "http://localhost:8000/api/categories";

    try {
      setCategoriesLoading(true)
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });
      if (!response.ok) throw new Error("");
      const data = await response.json()
      if (data) {
        setCategoriesLoading(false)
        setCategories(data.categories)
      }
    }
    catch (error) {
      setCategories('Failed to fetch categories.');
    }

  }
  useEffect(() => { if (token) getAllCategories() }, [token])
  useEffect(() => { if (refreshCategories) getAllCategories() }, [refreshCategories])

  return (
    <MyContext.Provider value={{ setToken, id, token, role, fullName, username, number, categories, setRefreshCategories }}>
      {children}
    </MyContext.Provider>
  );

};

export default MyContext;
