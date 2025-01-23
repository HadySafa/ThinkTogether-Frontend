import Login from './Forms/Login'
import SignUp from './Forms/Signup'
import Homepage from './Homepage'
import CreatePost from './CreatePost.jsx'
import Post from './Post/index.jsx'
import Profile from './Profile'
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
          <Route path="/Post" element={<Post />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  )

}

export default App
