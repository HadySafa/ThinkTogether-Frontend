import Login from './Forms/Login'
import SignUp from './Forms/Signup'
import Homepage from './Homepage'
import CreatePost from './CreatePost.jsx'
import Profile from './Profile'
import EditPost from './EditPost/index.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Homepage" element={<Homepage />} />
          <Route path="/NewPost" element={<CreatePost />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/EditPost" element={<EditPost />} />
        </Routes>
      </Router>
    </>
  )

}

export default App
