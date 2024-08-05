import React from "react";
import { useChatContext } from "../../context/ChatProviderContext";

const ChatList = ({ chatList }) => {
  const {selectedChat,setSelectedChat}=useChatContext()
  const handleUserSelect = (chat) => {
    setSelectedChat(chat);
    console.log("selectedChat",selectedChat)
  };
  return (
    <>
      <h2 className="m-2 text-xl text-yellow-50" >Chats</h2>
      <ul>
        {chatList.map((chat) => {
          console.log("chat",chat)
         return <li
            key={chat.id}
            className="flex items-center p-2 border rounded-lg hover:bg-gray-200 cursor-pointer my-1"
            onClick={() => handleUserSelect(chat)}
          >
            <img
              src={chat.users[1].imag}
              alt={chat.users[1].name}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div>
              <p className="font-semibold">{chat.users[1].name}</p>
              <p className="text-sm text-gray-600">{chat?.latestMessage?.content||""}</p>
            </div>
          </li>
        }
      )
        
        }
      </ul>
    </>
  );
};

export default ChatList;
