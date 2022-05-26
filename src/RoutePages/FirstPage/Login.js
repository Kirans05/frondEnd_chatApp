import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const nav = useNavigate()
  const toast = useToast()
  const [list,setList] = useState({
    email:"",
    password:""
  })

  const [show, setshow] = useState(false);
  const [loading,setloading] = useState(false) 

  const inputValueChange = (e) => {
    setList({...list,[e.target.name]:e.target.value})
  }

  const passwordEwditbtn = () => {
    setshow(!show)
  }

  const Submithandler = async () => {
    setloading(true)
    let axiosOptions = {
      url: "https://chat-app-capstone-2022.herokuapp.com/api/user/login",
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      data:list
    }

    let response = await axios(axiosOptions)
    if(response.data.message == "Login SuccessFull"){
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      toast({
        title:"Login SuccessFull",
        status:"success",
        duration:5000,
        isClosable:true,
        position:'bottom'
      })
      nav("/chat")
    }else {
      toast({
        title:"Invalid Email or Password",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:'bottom'
      })
    }
    
    setloading(false)
  }

  return (
    <div>
      <VStack spacing="10px">
        <FormControl id="email" isRequired>
          <FormLabel>Email Id</FormLabel>
          <Input type="email" placeholder="Enter Your Email Id" name="email" onChange={inputValueChange}
          value={list.email}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter password"
              name="password"
              onChange={inputValueChange}
              value={list.password}
              id="password"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm"
              onClick={()=>passwordEwditbtn()}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={Submithandler}
          isLoading={loading}
        >
          Login
        </Button>
      </VStack>
    </div>
  );
};

export default Login;
