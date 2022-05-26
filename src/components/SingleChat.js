import { ArrowBackIcon, SpinnerIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, omitThemingProps, Spinner, Text, toast, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../context/userContext'
import {getSender, getSenderFull} from "../config/logics"
import ProfileModel from './ProfileModel'
import UpdateGroupChatMOdel from './miscellanous/UpdateGroupChatMOdel'
import axios from 'axios'
import ScrolableChat from './miscellanous/ScrolableChat'
import io from "socket.io-client"
import Lottie from "lottie-react"
import animationData from "../animation/typing"



const ENDPOINT = "https://chat-app-capstone-2022.herokuapp.com/"
var socket , selectedChatCompare





const SingleChat = ({fetchChat, setfetchChat}) => {

    const toast = useToast()
    const [loading, setloading] = useState(false)
    const [message, setmessage] = useState([])
    const [newMessage,setnewMessage] = useState("")
    const [socketConnected,setsocketConnected] = useState(false)
    const [typing,settyping] = useState(false)
    const [isTyping,setisTyping] = useState(false)
    const {user, setselectedChat, selectedChat,setnotification,notification, classValue, setClassValue} = useContext(userContext)


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };



    const sendingMessage = async (e) => {
        if(e.key == "Enter" && newMessage){
            socket.emit("stop Typing",selectedChat._id)
            let options = {
                url:`https://chat-app-capstone-2022.herokuapp.com/api/message/`,
                headers:{
                    "content-type":"application/json",
                    Authorization:`Bearer ${user.tocken}`
                },
                method:"POST",
                data:{
                    content:newMessage,
                    chatId:selectedChat
                }
            }

            try{
                setnewMessage("")
                let response = await axios(options)
                setmessage([...message,response.data])
                socket.emit("new message",response.data)
            }catch(error){
                toast({
                    title:"Unable to Send Message",
                    duration:5000,
                    position:"bottom",
                    isClosable:true,
                    status:"error"
                })
            }
        }
    }


    const fetchMessage = async () => {
        if(!selectedChat) return ;

        let options = {
            url:`https://chat-app-capstone-2022.herokuapp.com/api/message/${selectedChat._id}`,
            headers:{
                "content-type":"application/json",
                Authorization:`Bearer ${user.tocken}`
            },
            method:"GET",
        }

        try{
            console.log("haghjgajhgashjgajghjagjhsgajhgshagjh")
            setloading(true)
            let response = await axios(options)
            console.log(response.data)
            setmessage(response.data)
            setloading(false)
            socket.emit("join-chat",selectedChat._id)
        }catch(error){
            toast({
                title:"Unable to get The Messages",
                duration:5000,
                position:"bottom",
                status:"error",
                isClosable:true
            })
        }
    }

    const typingHandler = (e) => {
        setnewMessage(e.target.value)

        if (!socketConnected) return;

    if (!typing) {
      settyping(true);
      socket.emit("typing", selectedChat._id);
    }


    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        settyping(false);
      }
    }, timerLength)
    }


    useEffect(()=>{
        fetchMessage()

        selectedChatCompare = selectedChat
    },[selectedChat])


    useEffect(() => {
        socket = io(ENDPOINT)
       socket.emit("setup",user)
       socket.on("connected",()=>setsocketConnected(true))
       socket.on("typing", () => setisTyping(true));
       socket.on("stop typing", () => setisTyping(false));
    })

    useEffect(()=>{
        socket.on("message received",(newMessageReceived) => {
            if(!selectedChatCompare || selectedChatCompare._id  !== newMessageReceived.chat._id){
                if(!notification.includes(newMessageReceived)){
                    setnotification([newMessageReceived,...notification])
                    setfetchChat(!fetchChat)
                }
            }else{
                setmessage([...message, newMessageReceived])
            }
        })
    })


    const iconBtn = () => {
        setselectedChat("")
        // if(classValue == "myChats"){
        //     setClassValue("myFullChats")
        // }else{

        // }
    }

    return (
   <Box
   w={"100%"}
   >
       {
           selectedChat ? 
           (
                <>
                    <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            bg={"white"}
          >
              <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
            //   onClick={() => setselectedChat("")}
            onClick={()=>iconBtn()}
              className="backIcon"
            />
            {
                !selectedChat.isGroupChat ? 
                (<>
                    {getSender(user,selectedChat.users)}
                    <ProfileModel user={getSenderFull(user,selectedChat.users)}/>

                </>)
                :  
                <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatMOdel fetchChat={fetchChat} setfetchChat={setfetchChat} fetchMessage={fetchMessage}/>
                </>
            }
          </Text>
                <Box
                d="flex"
                flexDir="column"
                justifyContent="flex-end"
                p={3}
                bg="#E8E8E8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
                >
                    {
                        loading ? <Spinner
                        size="xl"
                        w={20}
                        h={20}
                        alignSelf="center"
                        margin="auto"
                        color='red'
                      />
                      : (
                          <div>
                              <ScrolableChat message={message} />
                          </div>
                      )
                    }

                    <FormControl onKeyDown={sendingMessage}
                    isRequired
                    mt={3}
                    >
                        {isTyping ?
                        <div>
                            <Lottie
                            options={defaultOptions}
                            height={50}
                            color="black"
                            width={70}
                            style={{ marginBottom: 15, marginLeft: 0 }}
                          />
                        </div>
                        :null}
                        <Input 
                        type={"text"}
                        placeholder="Enter Message"
                        variant={'filled'}
                        value={newMessage}
                        onChange={typingHandler}
                        color="black"
                        />
                    </FormControl>
                </Box>

                </>
           )
           : (
               <Box 
               d="flex"
               justifyContent={"center"}
               alignItems={"center"}
               W="100%"
               h="100%"
               >
                  <Text fontSize="3xl" pb={3} fontFamily="Work sans">Click On A User To Chat</Text>
               </Box>
           )
       }
   </Box>
  )
}

export default SingleChat