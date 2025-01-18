import { useState } from 'react'
import Login from './Forms/Login'
import SignUp from './Forms/Signup'
import Homepage from './Homepage'
import CreatePost from './CreatePost.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Home" element={<Homepage />} />
          <Route path="/NewPost" element={<CreatePost />} />
        </Routes>
      </Router>
    </>
  )

}

export default App
