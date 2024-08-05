import React, { useEffect, useState } from "react";
import ScrollableChatBox from "./ScrollableChatBox";
import { useChatContext } from "../context/ChatProviderContext";
import Modal from "./Modal";

const ChatBox = ({ selectedChat }) => {
  const [chatId, setChatId] = useState(null);
  const { loginUser } = useChatContext();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  // console.log("select chat id",selectedChat)
  useEffect(() => {
    if (selectedChat) {
      setChatId(selectedChat.id);
    }
  }, [selectedChat, chatId]);

  return (
    <>
      <div
        className="flex justify-between m-2 border border-red-950 text-center items-center rounded-md"
        onClick={() => setIsProfileModalOpen(true)}
      >
        {selectedChat.isGroupChat == true ? (
          <>
            <h1 className="m-2">{selectedChat.chatName}</h1>
            <img
              src={selectedChat.groupImage}
              alt={selectedChat.groupImage}
              className="w-10 h-10 rounded-full mr-4 hover:cursor-pointer"
            />
          </>
        ) : (
          <>
            <h1 className="m-2">
              {loginUser.id == selectedChat.users[0].id
                ? selectedChat.users[1].name
                : selectedChat.users[0].name}
            </h1>
            <img
              src={
                loginUser.id == selectedChat.users[0].id
                  ? selectedChat.users[1].image
                  : selectedChat.users[0].image
              }
              alt={
                loginUser.id == selectedChat.users[0].id
                  ? selectedChat.users[1].name
                  : selectedChat.users[0].name
              }
              className="w-10 h-10 rounded-full mr-4 hover:cursor-pointer"
            />
          </>
        )}
      </div>
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      >
        {selectedChat.isGroupChat == true ? (
          <>
            <div className="flex flex-col items-center w-[350px] h-[250px]">
              <img
                src={selectedChat?.groupImage}
                alt={selectedChat?.chatName}
                className="w-44 h-44 rounded-full mb-4"
              />
              <p className="text-xl font-semibold">{selectedChat.chatName}</p>
              <p className="text-sm text-gray-600">{selectedChat.chatName}</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center w-[350px] h-[250px]">
              <img
                src={
                  loginUser.id == selectedChat.users[0].id
                    ? selectedChat.users[1].image
                    : selectedChat.users[0].image
                }
                alt={
                  loginUser.id == selectedChat.users[0].id
                    ? selectedChat.users[1].name
                    : selectedChat.users[0].name
                }
                className="w-44 h-44 rounded-full mb-4"
              />
              <p className="text-xl font-semibold">
                {loginUser.id == selectedChat.users[0].id
                  ? selectedChat.users[1].name
                  : selectedChat.users[0].name}
              </p>
              <p className="text-sm text-gray-600">
                {loginUser.id == selectedChat.users[0].id
                  ? selectedChat.users[1].name
                  : selectedChat.users[0].name}
              </p>
            </div>
          </>
        )}
      </Modal>
      <div className="mx-2 border border-red-950 h-96">
        {chatId && <ScrollableChatBox chatId={chatId} />}
      </div>
    </>
  );
};

export default ChatBox;
