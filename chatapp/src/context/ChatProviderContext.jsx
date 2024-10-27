/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import  { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
const ChatPorviderContext = createContext();

const ContextProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [loginUser, setLoginUser] = useState(null);
  const [chats, setChats] = useState(null);
  const navigate=useNavigate();
  useEffect(() => {
    const userInfo = Cookies.get("user");
    userInfo&&setLoginUser(JSON.parse(userInfo));
    if (userInfo) navigate("/");
  }, [navigate]);

  return (
    <ChatPorviderContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        loginUser,
        setLoginUser,
        chats,
        setChats
      }}
    >
      {children}
    </ChatPorviderContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatPorviderContext);
};

export default ContextProvider;
