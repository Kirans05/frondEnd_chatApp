import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../context/userContext";
import ChatLoading from "../chatLoading";
import { getSender } from "../../config/logics";
import GroupChatModel from "../GroupChatModel";
import HomeImage from "../../images/images.jpg"


const MyChats = ({ fetchChat }) => {
  const toast = useToast();
  const [loggedUser, setloggedUser] = useState();
  const { user, setuser, setselectedChat, setchat, chat, selectedChat, classValue, setClassValue } =
    useContext(userContext);


  const fetchChats = async () => {
    let oiptions = {
      url: "https://chat-app-capstone-2022.herokuapp.com/api/chat/fetchchat",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${user.tocken}`,
      },
      method: "GET",
    };
    try {
      let response = await axios(oiptions);
      setchat(response.data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // useEffect(() => {
  //   setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
  //   fetchChats();
  // }, []);
  useEffect(() => {
    setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchChat]);


  return (
    <Box bg="tomato" w="32%" p={4} color="white" overflowY={"auto"}  background="transparent" className={classValue}>
      <Box
        bg="white"
        w="100%"
        p={4}
        color="black"
        d="flex"
        flexDir={"row"}
        alignItems="center"
        justifyContent={"space-between"}
      >
        My Chats
        <GroupChatModel>
          <Button rightIcon={<AddIcon />} colorScheme="blue" variant="outline">
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <br />
      {chat ? (
        <Box
          w={"100%"}
          d="flex"
          flexDir={"column"}
          rowGap={"10px"}
          alignItems="flex-start"
        >
          {chat.map((userChat, index) => {
            console.log(userChat)
            return (
              <Box
                key={index}
                w="100%"
                p={4}
                color="black"
                borderRadius={"20px"}
                onClick={() => setselectedChat(userChat)}
                bg={selectedChat == userChat ? "#38B2AC" : "white"}
              >
                <Text>
                  {!userChat.isGroupChat
                    ? getSender(loggedUser, userChat.users)
                    : userChat.chatName}
                </Text>
              </Box>
            );
          })}
        </Box>
      ) : (
        <chatLoading />
      )}
    </Box>
  );
};

export default MyChats;
