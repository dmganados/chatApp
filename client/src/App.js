import React from "react";
// Implement page routing
// acquire the utilities from react-router-dom
import { BrowserRouter, Routes, Route} from 'react-router-dom'


// Acquire the pages that will make up the app
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Chat from './pages/chat/Chat';
import Profile from "./pages/profile/Profile";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chatApp" element={<Register />} />
        <Route path="/chatApp/login" element={<Login />} />
        <Route path="/chatApp/chat" element={<Chat />} />
        <Route path="/chatApp/profile" element={<Profile />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;