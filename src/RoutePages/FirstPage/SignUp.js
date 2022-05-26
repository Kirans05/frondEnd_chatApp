import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  ListIcon,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"


const SignUp = () => {
  const toast = useToast();
  const nav = useNavigate()
  const [list, setList] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
    pic: "",
  });

  const [show1, setshow1] = useState(false);
  const [show2, setshow2] = useState(false);
  const [loading, setloading] = useState(false);

  const inputValueChange = (e) => {
    setList({ ...list, [e.target.name]: e.target.value });
  };

  const filehandler = async (e) => {
    setloading(true);
    if (e.target.files[0] == undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return true;
    }

    if (
      e.target.files[0].type == "image/png" ||
      e.target.files[0].type == "image/jpeg"
    ) {
      const data = new FormData();
      data.append("file", e.target.files[0]);
      data.append("upload_preset", "random chat");
      data.append("cloud_name", "duoyghpxn");
      let response = await axios.post(
        "https://api.cloudinary.com/v1_1/duoyghpxn/image/upload",
        data
      );
      setList({ ...list, pic: response.data.url });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      return;
    }
    setloading(false);
  };

  const SubmitHandler = async () => {
    setloading(true);
    if (
      list.name == "" &&
      list.password1 == "" &&
      list.password2 == "" &&
      list.email == ""
    ) {
      toast({
        title: "Please Fill All The Fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    } else {
      if (list.password1 == list.password2) {
        let newDataList
        {list.pic == ""? newDataList = {
          name: list.name,
          email: list.email,
          password: list.password1,
        }
      :  newDataList = {
        name: list.name,
        email: list.email,
        password: list.password1,
        pic: list.pic,
      }
       }

        let axiosOptions = {
          url: "https://chat-app-capstone-2022.herokuapp.com/api/user",
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
          data: newDataList,
        };

        let response = await axios(axiosOptions);
        setloading(false);
        if (response.data.message == "Pleease Enter All The Fields") {
          toast({
            title: "Pleease Enter All The Fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        } else if (response.data.message == "User already exists") {
          toast({
            title: "User Already Exists",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }else if (response.data.message == "failed to create user"){
          toast({
            title: "failed to create user",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        } 
        else {
          localStorage.setItem("userInfo", JSON.stringify(response.data));
          toast({
            title: "SignUp SuccessFull",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          nav("/chat")
        }
      } else {
        toast({
          title: "Password Does Not Match",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setloading(false);
      }
    }
  };

  
  return (
    <div>
      <VStack spacing="15px">
        <FormControl id="email" isRequired>
          <FormLabel>UserName</FormLabel>
          <Input
            type="text"
            placeholder="Enter Your UserName"
            name="name"
            onChange={inputValueChange}
            value={list.name}
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email Id</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Email Id"
            name="email"
            onChange={inputValueChange}
            value={list.email}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>New Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show1 ? "text" : "password"}
              placeholder="Enter New password"
              name="password1"
              onChange={inputValueChange}
              value={list.password1}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setshow1(!show1)}>
                {show1 ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show2 ? "text" : "password"}
              placeholder="Enter New password"
              name="password2"
              onChange={inputValueChange}
              value={list.password2}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setshow2(!show2)}>
                {show2 ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Upload Image</FormLabel>
          <Input type="file" name="files" onChange={filehandler} />
        </FormControl>
        <Button
          colorScheme={"blue"}
          width="100%"
          style={{ marginTop: 15 }}
          onClick={SubmitHandler}
          isLoading={loading}
        >
          SignUp
        </Button>
      </VStack>
    </div>
  );
};

export default SignUp;
