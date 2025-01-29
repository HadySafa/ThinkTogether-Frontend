
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from 'react';

const MyContext = createContext();

export const MyProvider = ({ children }) => {

  const [token, setToken] = useState(sessionStorage.getItem('token') || '')
  const [role, setRole] = useState("")
  const [id, setId] = useState(null)
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [number,setNumber] = useState("")


  useEffect(() => {

    sessionStorage.setItem("token", token);

    if (token) {

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;  // in seconds
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
    <MyContext.Provider value={{ setToken, id, token, role, fullName, username, number}}>
      {children}
    </MyContext.Provider>
  );

};

// Export the context itself for useContext
export default MyContext;
