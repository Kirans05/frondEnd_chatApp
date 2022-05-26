import { Avatar, Box, Image, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ item, handleFunction }) => {
  return (
    <>
      <Box
        boxShadow="xl"
        borderRadius="md"
        color="black"
        px={4}
        h={"50px"}
        bg="#E8E8E8"
        _hover={{
          background: "#38B2AC",
          color: "white",
        }}
        d="flex"
        justifyContent={"flex-start"}
        alignItems={"center"}
        onClick={()=>handleFunction(item._id,item)}
      >
        <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={item.name}
        src={item.pic}
      />
        <Box
        d="flex"
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"flex-start"}
        >
          <Text>{item.name}</Text>
          <Text fontSize="xs">
            <b>Email : </b>
            {item.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default UserListItem;
