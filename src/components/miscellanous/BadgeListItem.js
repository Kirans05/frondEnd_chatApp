import { Badge, Box, CloseButton } from '@chakra-ui/react'
import React from 'react'

const BadgeListItem = ({handleFunction, item}) => {
  return (
    <Box
    d="flex"
    flexDir={"row"}
    justifyContent="center"
    alignItems={"center"}
    mr="5px"
    bg={"#AB13F7"}
    borderRadius="15px"
    onClick={() => handleFunction(item)}
    >
      <Badge colorScheme={"#AB13F7"} color="white" ml={"5px"}>
    {item.name}
  </Badge>  
    <CloseButton />
    </Box>
  )
}

export default BadgeListItem