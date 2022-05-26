import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const userContext = createContext()



const ChatProvider = ({children}) => {
    const nav = useNavigate()
    const [user,setuser] = useState()
    const [selectedChat,setselectedChat] = useState()
    const [chat,setchat] = useState([])
    const [notification,setnotification] = useState([])
    const [renderAll, setrenderAll] = useState(false)
  const [classValue, setClassValue] = useState("myChats")



    useEffect(() => {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"))
        setuser(userInfo)
        if(!userInfo){
            nav("/")
        }
        console.log("context redendered")
    },[nav])



    return (
    <userContext.Provider value={{user,setuser,setselectedChat,setchat,chat,selectedChat,setnotification,notification, renderAll, setrenderAll, classValue, setClassValue}}>
        {children}
    </userContext.Provider>
    ) 
}

export default ChatProvider



