/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useChatContext } from "../context/ChatProviderContext";
import { AxiosInstance } from "../api/apiInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import ChatList from "../components/chatlist/ChatList";
import Cookies from "js-cookie";
import ChatBox from "../components/ChatBox";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const ChatPage = () => {
  const [query, setQuery] = useState("");
  const [apiError, setError] = useState("");
  const navigate = useNavigate();
  const [searchUsers, setSearchUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatList, setChatLists] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreateGroup, setCreateGroup] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedFriendsIds, setSelectedFriendsIds] = useState([]);
  const [channelName, setChannelName] = useState("");

  const { loginUser, selectedChat, setSelectedChat } = useChatContext();
  const token = Cookies.get("token") || "";
  const fetchChats = async () => {
    try {
      setError("");
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
      setError("");
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
      setError("");
    }
  };

  const handleUserSelect = (chat) => {
    setSelectedChat(chat);
  };

  const accessChatHandel = async (user) => {
    try {
      setError("");
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
    setIsModalOpen(false);
  };

  const handleCheckboxChange = (chat) => {
    const chatId = chat.id;
    console.log("select chat of frined", chatId);
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(chatId)
        ? prevSelected.filter((id) => id !== chatId)
        : [...prevSelected, chatId]
    );
    setSelectedFriendsIds((prevSelected) => {
      const friendId =
        loginUser.id === chat.users[0].id ? chat.users[1].id : chat.users[0].id;
      return prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId];
    });
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    // console.log(selectedFriendsIds);

    try {
      setError("");
      const response = await AxiosInstance.post(
        `/chat/create-group`,
        { users: selectedFriendsIds, groupName: channelName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChatLists([...chatList, response.data.data]);
    } catch (error) {
      // console.error("Error fetching quotes", error.response.data.error);
      setError(error.response.data.error || "Failed to create group");
      toast.warning(`${error.response.data.error}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setCreateGroup(false);
      setChannelName("");
      setSelectedFriendsIds([]);
      setSelectedFriends([]);
    }
  };
  const logOUtHandle = async () => {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("user", { path: "/" });

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
  return (
    <div>
      <ToastContainer />
      <div className="relative h-16 m-4 grid gap-4 grid-cols-12 bg-gray-100  rounded-lg shadow-md">
        {/* Search Input and Button */}
        <div className="relative h-full bg-gray-800 md:col-span-4 col-span-9 flex items-center p-2 rounded-lg shadow-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email or name"
            className="border border-gray-400 rounded-lg p-2 w-full bg-gray-700 text-white outline-none placeholder-gray-300"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 ml-2 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {/* Modal */}
          {isModalOpen && (
            <div className="absolute top-full left-0 right-0 bg-white p-4 rounded-lg shadow-lg mt-2">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Friends</h2>
              <ul>
                {searchUsers.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center p-2 hover:bg-gray-200 cursor-pointer rounded-lg"
                    onClick={() => accessChatHandel(user)}
                  >
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200 ease-in-out"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Talk Here Section */}
        <div className="hidden md:col-span-7 md:flex justify-center items-center text-center bg-gray-700 font-bold text-xl text-gray-200 h-full rounded-lg shadow-sm">
          Talk Here
        </div>

        {/* Profile Image Section */}
        <div
          className="w-16 h-16 md:col-span-1 col-span-3 block rounded-full overflow-hidden cursor-pointer"
          onClick={() => setIsProfileModalOpen(true)}
        >
          <img
            src={loginUser?.image}
            alt={loginUser?.name}
            className="w-full h-full object-cover hover:opacity-90 transition duration-200 ease-in-out"
          />
        </div>
      </div>

      <div className="h-[80vh] m-4 grid gap-4 grid-cols-12 bg-gray-100 rounded-lg shadow-lg p-2">
        <div
          className={`${
            selectedChat ? "hidden" : "block"
          } sm:block col-span-12 sm:col-span-4 bg-gray-800 p-4 rounded-lg shadow-md overflow-y-auto`}
        >
          {chatList && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-yellow-50">Chats</h2>
                <button
                  onClick={() => setCreateGroup(true)}
                  className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition duration-200 ease-in-out"
                >
                  <FaPlus className="mr-2" />
                  <span>New Group</span>
                </button>
              </div>
              <ul className="w-full">
                {isCreateGroup ? (
                  <>
                    <span className="block text-lg font-semibold text-blue-200 mb-3 text-center">
                      Select Your Friends
                    </span>
                    {chatList
                      .filter((chat) => !chat.isGroupChat)
                      .map((chat) => (
                        <li
                          key={chat.id}
                          className="flex items-center p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer mb-2 transition"
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
                          <div className="flex-1">
                            <p className="font-semibold">
                              {loginUser.id === chat.users[0].id
                                ? chat.users[1].name
                                : chat.users[0].name}
                            </p>
                            <p className="text-sm text-gray-300">
                              {chat?.latestMessage?.content || ""}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded-full border border-gray-300 checked:bg-blue-500 checked:border-transparent cursor-pointer"
                            checked={selectedFriends.includes(chat.id)}
                            onChange={() => handleCheckboxChange(chat)}
                          />
                        </li>
                      ))}

                    <form
                      onSubmit={handleCreateGroup}
                      className="flex flex-col items-center w-full bg-gray-700 rounded-lg p-4 shadow-md mt-4"
                    >
                      <input
                        type="text"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        placeholder="Enter channel name"
                        className="w-full p-2 mb-4 border border-gray-300 rounded-md outline-none"
                      />
                      <div className="flex justify-between w-full">
                        <button
                          onClick={() => setCreateGroup(false)}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 ease-in-out"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 ease-in-out"
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  chatList.map((chat) => (
                    <li
                      key={chat.id}
                      className="flex items-center p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 cursor-pointer mb-2 transition"
                      onClick={() => handleUserSelect(chat)}
                    >
                      <img
                        src={
                          chat.isGroupChat
                            ? chat.groupImage
                            : loginUser.id === chat.users[0].id
                            ? chat.users[1].image
                            : chat.users[0].image
                        }
                        alt={
                          chat.isGroupChat
                            ? chat.chatName
                            : loginUser.id === chat.users[0].id
                            ? chat.users[1].name
                            : chat.users[0].name
                        }
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-semibold">
                          {chat.isGroupChat
                            ? chat.chatName
                            : loginUser.id === chat.users[0].id
                            ? chat.users[1].name
                            : chat.users[0].name}
                        </p>
                        <p className="text-sm text-gray-300">
                          {chat?.latestMessage?.content || ""}
                        </p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </>
          )}
        </div>

        <div
          className={`${
            selectedChat ? "block" : "hidden"
          } sm:block col-span-12 sm:col-span-8 bg-gray-800 rounded-lg shadow-md p-4`}
        >
          {selectedChat && <ChatBox selectedChat={selectedChat} />}
        </div>
      </div>

      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      >
        <div className="flex flex-col items-center w-[350px] h-[250px] bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md">
          {/* Profile Image */}
          <img
            src={loginUser?.image}
            alt={loginUser?.name}
            className="w-44 h-44 rounded-full mb-4 border-4 border-gray-600 shadow-lg"
          />

          {/* Name and Logout Button */}

          <div className="flex justify-between w-full">
            <p className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 ease-in-out">
              {loginUser?.name}
            </p>
            <button
              onClick={logOUtHandle}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 ease-in-out"
            >
              Log Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChatPage;
