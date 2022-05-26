import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useState } from "react";
import { userContext } from "../../context/userContext";
import BadgeListItem from "./BadgeListItem";
import UserListItem from "./UserListItem";

const UpdateGroupChatMOdel = ({ fetchChat, setfetchChat,fetchMessage }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  let { user, setuser, setselectedChat, setchat, chat, selectedChat, renderAll, setrenderAll } =
    useContext(userContext);
  const [renameGroup, setrenameGroup] = useState();
  const [renameLoading, setrenameLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const [searchResult, setsearchResult] = useState([]);

  const handleDelete = async (person) => {
    if(selectedChat.groupAdmin._id != user._id && person._id != user._id){
        toast({
            title:"Only Admin Can Remove User",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
        })
        return ;
    }

        let options = {
            url:"https://chat-app-capstone-2022.herokuapp.com/api/chat/removeUser",
            method:"PUT",
            headers:{
                "content-type":"application/json",
                Authorization:`Bearer ${user.tocken}`
            },
            data:{
                chatId : selectedChat._id,
                userId : person._id
            }
        }
        
        try{
            setloading(true)
            let response = await axios(options)
            console.log(response)
            {
                person._id == user._id ? setselectedChat() : setselectedChat(response.data)
            }
            setloading(false)
            setfetchChat(!fetchChat)
            setrenderAll(!renderAll)
            fetchMessage()
        }catch(error){
            toast({
                title:"Unable to Remove User",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
    }
  };

  const renameFieldChange = (e) => {
    setrenameGroup(e.target.value);
  };

  const handleSearch = async (e) => {
    // if (!e.target.value) {
    //   toast({
    //     title: "Enter An User",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //   });
    // }

    let options = {
      url: `https://chat-app-capstone-2022.herokuapp.com/api/user?search=${e.target.value}`,
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${user.tocken}`,
      },
    };

    try {
      setloading(true);
      let response = await axios(options);
      setsearchResult(response.data);
      setloading(false);
    } catch (error) {
      toast({
        title: "Unable to Get Users",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRename = async () => {
    if (!renameGroup) {
      toast({
        title: "Enter New Group Name",
        duration: 5000,
        status: "error",
        isClosable: true,
      });
    }

    let options = {
      url: "https://chat-app-capstone-2022.herokuapp.com/api/chat/rename",
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${user.tocken}`,
      },
      data: {
        chatId: selectedChat._id,
        chatName: renameGroup,
      },
    };

    try {
      setrenameLoading(true);
      let response = await axios(options);

      console.log(response.data);
      setrenameLoading(false);
      setselectedChat(response.data);
      setfetchChat(!fetchChat);
      setrenameGroup("");
    } catch (error) {
      toast({
        title: "Unable to Update Group Name",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const addToGroup = async (person_id,person) => {
      
      if(selectedChat.users.find(u => u._id == person_id)){
        toast({
            title:"User Already In The Group",
            status:"error",
            duration:5000,
            isClosable:true
        })
        return ;
    }

    if(selectedChat.groupAdmin._id != user._id ){
        toast({
            title:"Only Admin are allowed to Add user",
            status:"error",
            duration:5000,
            isClosable:true
        })
        return ;
    }

    let options = {
        url:"https://chat-app-capstone-2022.herokuapp.com/api/chat/addToGroup",
        method:"PUT",
        headers:{
            "content-type":"application/json",
            Authorization:`Bearer ${user.tocken}`
        },
        data:{
            chatId:selectedChat._id,
            userId:person_id
        }
    }

    try{
        let response = await axios(options)
        setselectedChat(response.data)
        setfetchChat(!fetchChat)
    }catch(error){
        toast({
            title:"Unable to Add User",
            status:"error",
            duration:5000,
            isClosable:true
        })
    }
  }
  return (
    <>
      <IconButton onClick={onOpen} icon={<ViewIcon />} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader d="flex" justifyContent={"center"} fontSize="4xl">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              d="flex"
              flexDir={"row"}
              alignItems="center"
              justifyContent={"flex-start"}
            >
              {selectedChat.users.map((item, index) => {
                return (
                  <BadgeListItem
                    key={index}
                    handleFunction={handleDelete}
                    item={item}
                  />
                );
              })}
            </Box>
            <br />
            <FormControl
              d="flex"
              alignItems={"center"}
              justifyContent="space-between"
            >
              <Input
                type={"text"}
                placeholder="Rename Group"
                onChange={renameFieldChange}
                value={renameGroup}
                mr="15px"
              />
              <Button
                variant={"solid"}
                colorScheme="green"
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <br />
            <FormControl>
              <Input
                type={"text"}
                placeholder="Add Users"
                onChange={handleSearch}
              />
            </FormControl>
              <br />
            <Box>
              {
                  loading ? <Spinner color='red.500'/>
                  : searchResult ?.slice(0,4).map((item,index) => {
                      return <>
                        <UserListItem
                      key={index}
                      item={item}
                      handleFunction={addToGroup}
                    />
                    <br />
                      </>
                  })
              }

            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={()=>handleDelete(user)}>
              Leave
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatMOdel;
