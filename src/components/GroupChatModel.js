import React, { useContext, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import { userContext } from "../context/userContext";
import axios from "axios";
import UserListItem from "./miscellanous/UserListItem";
import BadgeListItem from "./miscellanous/BadgeListItem";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, chat, setchat } = useContext(userContext);
  const [groupName, setgroupName] = useState("");
  const [selecteduser, setselecteduser] = useState([]);
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState();
  const toast = useToast();

  const getUsers = async (e) => {
    setsearch(e.target.value);
    let options = {
      url: `https://chat-app-capstone-2022.herokuapp.com/api/user?search=${e.target.value}`,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${user.tocken}`,
      },
      method: "GET",
    };

    try {
      setloading(true);
      let response = await axios(options);
      setloading(false);
      setsearchResult(response.data);
    } catch (error) {
      toast({
        title: "Error Occured",
        duration: 5000,
        position: "bottom",
        isClosable: true,
      });
    }
  };

  const addToGroup = (person_id, person) => {
    if (selecteduser.includes(person)) {
      return;
    }

    setselecteduser([...selecteduser, person]);
  };

  const handleDelete = (person) => {
    setselecteduser(selecteduser.filter((list) => list._id != person._id));
  };

  const functionInput = (e) => {
    setsearch(e.target.value);
    getUsers(e);
  };

  const createGroup = async () => {
    if (!groupName || !selecteduser) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    let options = {
      url: "https://chat-app-capstone-2022.herokuapp.com/api/chat/group",
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${user.tocken}`,
      },
      data: {
        name: groupName,
        users:JSON.stringify(selecteduser),
      },
    };

    try{
        let response = await axios(options)
        console.log(response.data)
        let {data} = response
        setchat([response.data, ...chat]);
        console.log("first")
        toast({
            title: "New Group Chat Created!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        onClose();
    }catch(error){
        console.log(error)
        toast({
            title: "Unable to Create Group",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            d="flex"
            flexDir={"row"}
            alignItems="center"
            justifyContent={"center"}
          >
            New Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              d="flex"
              flexDirection={"column"}
              justifyContent="space-between"
              rowGap={"20px"}
            >
              <Input
                placeholder="Group Name"
                type={"text"}
                onChange={(e) => setgroupName(e.target.value)}
              />
              <Input
                placeholder="Add User"
                value={search}
                type={"text"}
                onChange={functionInput}
              />
            </FormControl>
            <br />
            <Box
              d="flex"
              flexDir={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
              flexWrap={"wrap"}
            >
              {selecteduser.map((item, index) => {
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
            {loading ? (
              <div>Loading ....</div>
            ) : (
              searchResult.slice(0, 4).map((item, index) => {
                return (
                  <>
                    <UserListItem
                      key={index}
                      item={item}
                      handleFunction={addToGroup}
                    />
                    <br />
                  </>
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={createGroup}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
