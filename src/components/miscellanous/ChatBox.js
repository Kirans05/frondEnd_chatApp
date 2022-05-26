import React, { useContext } from 'react'
import { Box } from "@chakra-ui/react"
import { userContext } from '../../context/userContext'
import SingleChat from '../SingleChat'


const ChatBox = ({fetchChat,setfetchChat}) => {

  const {selectedChat} = useContext(userContext)
  return (
   <Box
   d={{base : selectedChat ? 'flex' : "none", md:"flex" }}
   w={"66%"}
  //  bg="red"
   color={"black"}
   className="chatBox"
   >
     <SingleChat fetchChat={fetchChat} setfetchChat={setfetchChat} />
   </Box>
  )
}

export default ChatBox