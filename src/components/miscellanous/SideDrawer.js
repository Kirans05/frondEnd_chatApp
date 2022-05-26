import React, { useContext, useEffect, useState } from "react";
import { BellIcon, ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import { userContext } from "../../context/userContext";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  toast,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import ProfileModel from "../ProfileModel";
import ChatLoading from "../chatLoading";
import axios from "axios";
import UserListItem from "./UserListItem";
import { useNavigate } from "react-router-dom";
import { getSender } from "../../config/logics";
import NotificationBadge, { Effect } from "react-notification-badge"


const SideDrawer = () => {
  const nav = useNavigate();
  const toast = useToast();
  const { user,setuser,setselectedChat,setchat,chat,setnotification,notification} = useContext(userContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [serachvalue, setserachvalue] = useState("");
  const [chatLoadinIcon, setchatLoadinIcon] = useState(false);
  const [searchResult, setsearchResult] = useState("");
  const [loadingChat,setloadingChat]  = useState(false)

  const searchValueHandler = (e) => {
    setserachvalue(e.target.value);
  };

  const handlerSearch = async () => {
    if (!serachvalue) {
      toast({
        title: "Enter User Name to Search.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    let options = {
      url: `https://chat-app-capstone-2022.herokuapp.com/api/user?search=${serachvalue}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.tocken}`,
      },
    };
    try {
      setchatLoadinIcon(true);
      let response = await axios(options);
      setsearchResult(response.data);
      setchatLoadinIcon(false);
    } catch (error) {
      toast({
        title: "Error Occured.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const LogoutHandler = () => {
    localStorage.removeItem("userInfo");
    nav("/");
  };


const accessChat = async (userId,user_details) => {
  console.log(userId)
  let options = {
    url:"https://chat-app-capstone-2022.herokuapp.com/api/chat",
    headers:{
      "content-type":"application/json",
      Authorization :`Bearer ${user.tocken}`
    },
    method:"POST",
    data:{userId}
  }
  try{
    setloadingChat(true)
    let resposne = await axios(options)
    if (!chat.find((c) => c._id === resposne.data._id)) setchat([resposne.data, ...chat]);
    setselectedChat(resposne.data)
    onClose()
    setloadingChat(false)

  }catch(error){
    toast({
      title: "Error fetching the chat",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
}

  return (
    <>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
        padding="0.5"
        backgroundColor={"white"}
      >
        <Tooltip
          hasArrow
          label="Search User"
          bg="gray.300"
          color="black"
          placement="bottom-end"
        >
          <Button
            colorScheme="teal"
            variant="ghost"
            d="flex"
            flexDir={"row"}
            justifyContent={"space-around"}
            w="1xl"
            onClick={onOpen}
          >
            <Search2Icon />
            <Text fontSize="2xl">Search</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl">Random Chat</Text>
        <div
          style={{
            width: "100px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Menu>
            <MenuButton as={Box} bg="white" rightIcon={<ChevronDownIcon />}>
              <NotificationBadge 
              count={notification.length}
              effect={Effect.Scale}
              />
              <BellIcon fontSize={"3xl"} />
            </MenuButton>
            <MenuList>
              {!notification.length && "no new messages"}
              {
              notification.map((not,index) => {
                return <MenuItem key={index} onClick={() => {
                  setselectedChat(not.chat)
                  setnotification(notification.filter(n => n !== not))
                }}>
                  {not.chat.isGroupChat ? `New Message in ${not.chat.chatName}`
                  : `New Message from ${getSender(user,not.chat.users)}`
                  }
                </MenuItem>
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Box} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar src={user.pic} name={user.name} />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModel>
              <Divider />
              <MenuItem onClick={LogoutHandler}>LogOut</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Box
              p="3"
              d="flex"
              alignItems={"center"}
              justifyContent="space-between"
            >
              <Input
                placeholder="Search User"
                size="sm"
                value={serachvalue}
                onChange={searchValueHandler}
              />
              <Button onClick={handlerSearch}>Go</Button>
            </Box>
            {chatLoadinIcon ? (
              <ChatLoading />
            ) : searchResult.length ? (
              <Box
                d="flex"
                flexDir={"column"}
                justifyContent={"center"}
                alignItems="stretch"
                rowGap={"20px"}
                overflowY={"suto"}
              >
                {searchResult.map((item, index) => {
                  return <UserListItem key={index} item={item} handleFunction={accessChat}/>;
                })}
              </Box>
            ) : (
              <Text fontSize="30px" color="tomato">
                No User
              </Text>
            )}
            {loadingChat && <Spinner color='red.500' ml={"auto"}/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
