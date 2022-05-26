import React from 'react'
import {Route, Routes} from "react-router-dom"
import ChatPage from './RoutePages/ChatPage'
import Home from './RoutePages/Home'

const App = () => {
  return (
    <div className='appDiv'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default App