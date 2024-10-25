/* eslint-disable react-hooks/exhaustive-deps */
import {  useEffect, useState } from "react";
import { useChatContext } from "../context/ChatProviderContext";
import { AxiosInstance } from "../api/apiInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import ChatList from "../components/chatlist/ChatList";
import Cookies from "js-cookie";
import ChatBox from "../components/ChatBox";
import Modal from "../components/Modal";

const ChatPage = () => {
  const [query, setQuery] = useState("");
  const [apiError, setError] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatList, setChatLists] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { loginUser, selectedChat, setSelectedChat } = useChatContext();
  const token = Cookies.get("token") || "";
  const fetchChats = async () => {
    try {
      const response = await AxiosInstance.get(`/chat/all-chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatLists(response.data.data);
    } catch (error) {
      console.error("Error fetching chats", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [selectedChat]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.get(`/user/find-friend?q=${query}`);
      setSearchUsers(response.data.data);
      setQuery("");
      setIsModalOpen(true); // Open the modal when search results are received
    } catch (error) {
      console.error("Error fetching quotes", error);
      setError(error.response.data.error);
      toast.warning(`${apiError}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleUserSelect = (chat) => {
    setSelectedChat(chat);
  };

  const accessChatHandel = async (user) => {
    try {
      const response = await AxiosInstance.post(
        `/chat/access-chat`,
        { userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChatLists([...chatList, response.data.data]);
    } catch (error) {
      console.error("Error fetching quotes", error);
      setError(error.response.data.error);
      toast.warning(`${error}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <ToastContainer />
      <div className="relative h-20 m-4 grid gap-4 grid-cols-12">
        <div className="relative h-full bg-slate-500 md:col-span-4 col-span-9 flex items-center p-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email or name"
            className="border p-2 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 ml-2 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isModalOpen && (
            <div className="absolute top-full left-0 right-0 bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Friends</h2>
              <ul>
                {searchUsers.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => accessChatHandel(user)}
                  >
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 bg-red-500 text-white p-2 rounded"
              >
                Close
              </button>
            </div>
          )}
        </div>
        <div className="hidden justify-center items-center text-center bg-slate-600 font-bold text-xl text-slate-200 h-full md:col-span-7 md:flex">
          Talk Here
        </div>
        <div
          className=" w-20 h-20 md:col-span-1 col-span-3 block "
          onClick={() => setIsProfileModalOpen(true)}
        >
          <img
            src={loginUser?.image}
            alt={loginUser?.name}
            className="rounded-xl w-full h-full object-cover hover:cursor-pointer"
          />
        </div>
      </div>

      <div className="h-[80vh] m-4 grid gap-4 grid-cols-12">
        <div className="col-span-12 sm:col-span-4 bg-slate-500 sm:block p-3">
          {chatList && (
            <>
              <h2 className="m-2 text-xl text-yellow-50">Chats</h2>
              <ul>
                {chatList.map((chat) => {
                  return chat.isGroupChat === true ? (
                    <li
                      key={chat.id}
                      className="flex items-center p-2 border rounded-lg hover:bg-gray-200 cursor-pointer my-1"
                      onClick={() => handleUserSelect(chat)}
                    >
                      <img
                        src={chat.groupImage}
                        alt={chat.chatName}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-semibold">{chat.chatName}</p>
                        <p className="text-sm text-gray-600">
                          {chat?.latestMessage?.content || ""}
                        </p>
                      </div>
                    </li>
                  ) : (
                    <li
                      key={chat.id}
                      className="flex items-center p-2 border rounded-lg hover:bg-gray-200 cursor-pointer my-1"
                      onClick={() => handleUserSelect(chat)}
                    >
                      <img
                        src={
                          loginUser.id === chat.users[0].id
                            ? chat.users[1].image
                            : chat.users[0].image
                        }
                        alt={
                          loginUser.id === chat.users[0].id
                            ? chat.users[1].name
                            : chat.users[0].name
                        }
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-semibold">
                          {loginUser.id === chat.users[0].id
                            ? chat.users[1].name
                            : chat.users[0].name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {chat?.latestMessage?.content || ""}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
        <div className="hidden col-span-12 sm:col-span-8 bg-blue-100 sm:block">
          {selectedChat && <ChatBox selectedChat={selectedChat} />}
        </div>
      </div>

      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}>
        <div className="flex flex-col items-center w-[350px] h-[250px]">
          <img
            src={loginUser?.image}
            alt={loginUser?.name}
            className="w-44 h-44 rounded-full mb-4"
          />
          <p className="text-xl font-semibold">{loginUser?.name}</p>
          <p className="text-sm text-gray-600">{loginUser?.email}</p>
        </div>
      </Modal>
    </div>
  );
};

export default ChatPage;
