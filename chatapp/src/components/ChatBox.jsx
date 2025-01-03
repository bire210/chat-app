/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import ScrollableChatBox from "./ScrollableChatBox";
import { useChatContext } from "../context/ChatProviderContext";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { AxiosInstance } from "../api/apiInstance";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

const ChatBox = ({ selectedChat }) => {
  const [chatId, setChatId] = useState(null);
  const [groupMembers, setGroupMember] = useState([]);
  const [groupMembersId, setGroupMemberIds] = useState([]);
  const [friends, setFriends] = useState(null);
  const { loginUser, setSelectedChat } = useChatContext();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const token = Cookies.get("token") || "";

  const fetchFriends = useCallback(async () => {
    try {
      const response = await AxiosInstance.get(`/user/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(response.data.data);
    } catch (error) {
      console.error("Error fetching friends", error);
    }
  }, [token]);

  useEffect(() => {
    if (selectedChat) {
      setChatId(selectedChat.id);
      setGroupMember(selectedChat.isGroupChat ? selectedChat.users : []);
      setGroupMemberIds(
        selectedChat.isGroupChat
          ? selectedChat.users.map((friend) => friend.id)
          : []
      );
      if (selectedChat.isGroupChat) fetchFriends();
    }
  }, [selectedChat, fetchFriends]);

  const onAddToGroup = async (userId) => {
    try {
      const response = await AxiosInstance.post(
        `/chat/add-member`,
        { groupId: chatId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroupMember(response.data.data.users);
      setGroupMemberIds(response.data.data.users.map((friend) => friend.id));
    } catch (error) {
      toast.warning(error.response.data.error);
    }
  };

  const handleDelete = useCallback(
    async (userId) => {
      try {
        const response = await AxiosInstance.post(
          `/chat/remove-member`,
          { groupId: chatId, userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGroupMember(response.data.data.users);
        setGroupMemberIds(response.data.data.users.map((friend) => friend.id));
      } catch (error) {
        toast.warning(error.response.data.error);
      }
    },
    [chatId, token]
  );

  return (
    <>
      {/* Chat Header Section */}
      <div className="flex justify-between m-2 border border-gray-800 text-center items-center rounded-md bg-gray-700 p-2">
        {/* Left Arrow Icon for small devices only */}
        <FaArrowLeft
          className="text-gray-200 text-xl ml-2 sm:hidden hover:cursor-pointer"
          onClick={() => setSelectedChat(null)} // Optional: Clears the selected chat on click
        />

        {selectedChat.isGroupChat ? (
          <>
            <h1 className="m-2 text-gray-200 font-semibold">
              {selectedChat.chatName}
            </h1>
            <img
              onClick={() => setIsProfileModalOpen(true)}
              src={selectedChat.groupImage}
              alt={selectedChat.chatName}
              className="w-10 h-10 rounded-full mr-4 hover:cursor-pointer"
            />
          </>
        ) : (
          <>
            <h1 className="m-2 text-gray-200 font-semibold">
              {loginUser.id === selectedChat.users[0].id
                ? selectedChat.users[1].name
                : selectedChat.users[0].name}
            </h1>
            <img
              onClick={() => setIsProfileModalOpen(true)}
              src={
                loginUser.id === selectedChat.users[0].id
                  ? selectedChat.users[1].image
                  : selectedChat.users[0].image
              }
              alt={
                loginUser.id === selectedChat.users[0].id
                  ? selectedChat.users[1].name
                  : selectedChat.users[0].name
              }
              className="w-10 h-10 rounded-full mr-4 hover:cursor-pointer"
            />
          </>
        )}
      </div>

      {/* Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      >
        {selectedChat.isGroupChat ? (
          <div className="flex flex-col items-center w-[100%] min-h-[350px] bg-gray-800 rounded-lg shadow-lg p-4">
            {/* Group Header */}
            <div className="border-b border-gray-700 flex justify-between w-full items-center p-2">
              <img
                src={selectedChat.groupImage}
                alt={selectedChat.chatName}
                className="w-16 h-16 rounded-full"
              />
              <p className="text-xl font-semibold text-gray-200">
                {selectedChat.chatName}
              </p>
            </div>

            {/* Group Members */}
            <p className="text-left mt-3 mb-1 bg-slate-600 font-bold text-gray-200 rounded-xl p-1">
              Group Members
            </p>
            <div className="w-full flex flex-wrap justify-between p-1">
              {groupMembers.map((user) => (
                <div
                  key={user.id}
                  className="flex mt-2 border border-gray-700 p-2 rounded-md justify-between items-center w-[45%] bg-gray-700"
                >
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-7 h-7 rounded-full"
                  />
                  <p className="text-gray-200 text-sm">{user.name}</p>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="ml-2 text-red-500 hover:text-red-600"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Member Section */}
            <p className="text-left mt-3 mb-1 bg-slate-600 font-bold text-gray-200 rounded-xl p-1">
              Add New Member
            </p>
            <div className="w-full flex flex-wrap justify-between p-1">
              {friends &&
                friends
                  .filter((friend) => !groupMembersId.includes(friend.id))
                  .map((friend) => (
                    <div
                      key={friend.id}
                      className="flex mt-2 border border-gray-700 p-2 rounded-md justify-between items-center w-[45%] bg-gray-700"
                    >
                      <img
                        src={friend.image}
                        alt={friend.name}
                        className="w-7 h-7 rounded-full"
                      />
                      <p className="text-gray-200 text-sm">{friend.name}</p>
                      <button
                        onClick={() => onAddToGroup(friend.id)}
                        className="ml-2 text-green-500 hover:text-green-600"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-[100%] h-[250px] bg-gray-800 rounded-lg shadow-lg p-4">
            <img
              src={
                loginUser.id === selectedChat.users[0].id
                  ? selectedChat.users[1].image
                  : selectedChat.users[0].image
              }
              alt={
                loginUser.id === selectedChat.users[0].id
                  ? selectedChat.users[1].name
                  : selectedChat.users[0].name
              }
              className="w-32 h-32 rounded-full mb-4"
            />
            <p className="text-xl font-semibold text-gray-200">
              {loginUser.id === selectedChat.users[0].id
                ? selectedChat.users[1].name
                : selectedChat.users[0].name}
            </p>
          </div>
        )}
      </Modal>

      {/* Chat Messages Section */}
      <div className="mx-2 border border-gray-800 bg-gray-700 h-[86%] sm:h-96 rounded-md shadow-inner overflow-y-auto">
        {chatId && <ScrollableChatBox chatId={chatId} />}
      </div>
    </>
  );
};

export default ChatBox;
