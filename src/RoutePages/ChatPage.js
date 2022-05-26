import { Box, useConst } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import ChatBox from '../components/miscellanous/ChatBox'
import MyChats from '../components/miscellanous/MyChats'
import SideDrawer from '../components/miscellanous/SideDrawer'
import { userContext } from '../context/userContext'
import HomeImage from "../images/images.jpg"
const ChatPage = () => {
  const {user} = useContext(userContext)
  const [fetchChat,setfetchChat] = useState(false)

  // useEffect(() => {
  //   console.log("chatPage rerendered")
  // },[fetchChat])


  return (
    <div style={{width:"100%",backgroundColor:"white"}} className={"mychatPage"}>
      {user && <SideDrawer />}
      <Box
      d="flex"
      justifyContent={"space-between"}
      width="100%"
      height={"86vh"}
      p="10px"
      >
        {user && <MyChats fetchChat={fetchChat}/>}
        {user && <ChatBox fetchChat={fetchChat} setfetchChat={setfetchChat}/>}
      </Box>
    </div>
  )
}

export default ChatPage