
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from 'react';

const MyContext = createContext();

export const MyProvider = ({ children }) => {

  const [token, setToken] = useState(sessionStorage.getItem('token') || '')
  const [role, setRole] = useState("")
  const [id, setId] = useState(null)
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [number, setNumber] = useState("")
  const [categories, setCategories] = useState([])
  const [refreshCategories,setRefreshCategories] = useState(true)

  // get categories
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
      setError(error.message)
    }
  }
  useEffect(() => { if (refreshCategories) getAllCategories() }, [refreshCategories])


  // decode token
  useEffect(() => {

    sessionStorage.setItem("token", token);

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        setToken('');
        sessionStorage.removeItem('token');
      } else {
        setRole(decodedToken.Role);
        setId(decodedToken.Id);
        setFullName(decodedToken.FullName)
        setUsername(decodedToken.Username)
        setNumber(decodedToken.PhoneNumber)
      }
    }

  }, [token])

  return (
    <MyContext.Provider value={{ setToken, id, token, role, fullName, username, number, categories, setRefreshCategories }}>
      {children}
    </MyContext.Provider>
  );

};

export default MyContext;
