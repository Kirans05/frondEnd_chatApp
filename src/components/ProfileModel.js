import { ViewIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { userContext } from "../context/userContext";

const ProfileModel = ({ children, user }) => {
  // const { user } = useContext(userContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? <span onClick={onOpen}>{children}</span> : 
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen}/>
      }

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent d="flex" flexDir={"column"}>
          <ModalHeader
            display={"flex"}
            justifyContent="center"
            alignItems={"center"}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir={"column"}
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text fontSize={"2xl"}>{user.email}</Text>
          </ModalBody>

          <ModalFooter d="flex" justifyContent={"flex-end"}>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;
