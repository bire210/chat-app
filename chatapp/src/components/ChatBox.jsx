// import React, { useCallback, useEffect, useState } from "react";
// import ScrollableChatBox from "./ScrollableChatBox";
// import { useChatContext } from "../context/ChatProviderContext";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Modal from "./Modal";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
// import { AxiosInstance } from "../api/apiInstance";
// import Cookies from "js-cookie";
// const ChatBox = ({ selectedChat }) => {
//   const [chatId, setChatId] = useState(null);
//   const [groupMembers, setGroupMember] = useState(null);
//   const [friends, setFriends] = useState(null);
//   const [error, setError] = useState(null);
//   const { loginUser } = useChatContext();
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   // console.log("select chat id",selectedChat)
//   const token = Cookies.get("token") || "";
//   useEffect(() => {
//     if (selectedChat) {
//       setChatId(selectedChat.id);
//     }
//     if (selectedChat.isGroupChat) {
//       setGroupMember(selectedChat.users);
//       fetchFriends();
//     }
//   }, [selectedChat, chatId, groupMembers,isProfileModalOpen]);

//   const onAddToGroup = async (users) => {
//     const userId = loginUser.id === users[0].id ? users[1].id : users[0].id;
//     try {
//       const response = await AxiosInstance.post(
//         `/chat/add-member`,
//         { groupId: chatId, userId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setGroupMember(response.data.data);
//     } catch (error) {
//       // console.error("already in group", error.response.data.error);
//       toast.warning(`${error.response.data.error}`, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//     }
//   };

//   const handleDelete = useCallback(
//     async (userId) => {
//       const updatedMembers = groupMembers.filter(
//         (member) => member.id !== userId
//       );

//       setGroupMember(updatedMembers);
//       try {
//         const response = await AxiosInstance.post(
//           `/chat/remove-member`,
//           { groupId: chatId, userId },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setGroupMember(response.data.data);
//       } catch (error) {
//         console.error("not deleted", error.response.data.error);
//         toast.warning(`${error.response.data.error}`, {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "light",
//         });
//       }
//     },
//     [groupMembers]
//   );
//   const fetchFriends = useCallback(async () => {
//     try {
//       const response = await AxiosInstance.get(`/chat/all-chats`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setFriends(response.data.data.filter((chat) => chat.isGroupChat != true));
//     } catch (error) {
//       console.error("Error fetching chats", error);
//     }
//   }, [friends]);

//   return (
//     <>
//       <div
//         className="flex justify-between m-2 border border-red-950 text-center items-center rounded-md"
//         onClick={() => setIsProfileModalOpen(true)}
//       >
//         {selectedChat.isGroupChat == true ? (
//           <>
//             <h1 className="m-2">{selectedChat.chatName}</h1>
//             <img
//               src={selectedChat.groupImage}
//               alt={selectedChat.groupImage}
//               className="w-10 h-10 rounded-full mr-4 hover:cursor-pointer"
//             />
//           </>
//         ) : (
//           <>
//             <h1 className="m-2">
//               {loginUser.id == selectedChat.users[0].id
//                 ? selectedChat.users[1].name
//                 : selectedChat.users[0].name}
//             </h1>
//             <img
//               src={
//                 loginUser.id == selectedChat.users[0].id
//                   ? selectedChat.users[1].image
//                   : selectedChat.users[0].image
//               }
//               alt={
//                 loginUser.id == selectedChat.users[0].id
//                   ? selectedChat.users[1].name
//                   : selectedChat.users[0].name
//               }
//               className="w-10 h-10 rounded-full mr-4 hover:cursor-pointer"
//             />
//           </>
//         )}
//       </div>
//       <Modal
//         isOpen={isProfileModalOpen}
//         onClose={() => setIsProfileModalOpen(false)}
//       >
//         {selectedChat.isGroupChat == true ? (
//           <>
//             <div className="flex flex-col items-center w-[350px] h-[350px]">
//               <div className="border flex justify-between w-full items-center ">
//                 <img
//                   src={selectedChat?.groupImage}
//                   alt={selectedChat?.chatName}
//                   className="w-16 h-16 rounded-full"
//                 />
//                 <p className="text-xl font-semibold">{selectedChat.chatName}</p>
//               </div>
//               <p className=" text-left p-1 bg-slate-600 font-bold text-x text-slate-200 rounded-xl">Group members</p>
//               <div className="w-full flex flex-wrap justify-between  p-1">
//                 {groupMembers?.length > 0 &&
//                   groupMembers.map((user, index) => (
//                     <div className="flex mt-2 border p-1 rounded-md justify-between items-center w-[30%] h-7">
//                       <img
//                         src={user.image}
//                         alt={user.name}
//                         className="w-7 h-7 rounded-full "
//                       />
//                       <p className="text-x font-normal">{user.name}</p>
//                       <button
//                         onClick={() => handleDelete(user.id)}
//                         className="ml-1 text-red-500 hover:text-red-700"
//                       >
//                         {/* Font Awesome cross icon */}
//                         <FontAwesomeIcon icon={faTimes} />
//                       </button>
//                     </div>
//                   ))}
//               </div>
//               <p className="text-left p-1 bg-slate-600 font-bold text-x text-slate-200 rounded-xl">Add new member</p>
//               <div className="w-full flex flex-wrap justify-between  p-1">
//                 {friends &&
//                   friends.map((chat) => {
//                     return (
//                       <div
//                         key={chat.id}
//                         className="flex mt-2 border p-1 rounded-md justify-between items-center w-[30%] h-7"
//                       >
//                         <img
//                           src={
//                             loginUser.id === chat.users[0].id
//                               ? chat.users[1].image
//                               : chat.users[0].image
//                           }
//                           alt={
//                             loginUser.id === chat.users[0].id
//                               ? chat.users[1].name
//                               : chat.users[0].name
//                           }
//                           className="w-7 h-7 rounded-full"
//                         />

//                         <p className="text-x font-normal">
//                           {loginUser.id === chat.users[0].id
//                             ? chat.users[1].name
//                             : chat.users[0].name}
//                         </p>

//                         <button
//                           onClick={() => onAddToGroup(chat.users)}
//                           className="ml-2 text-green-500 hover:text-green-700"
//                         >
//                           {/* Font Awesome plus icon */}
//                           <FontAwesomeIcon icon={faPlus} />
//                         </button>
//                       </div>
//                     );
//                   })}
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="flex flex-col items-center w-[350px] h-[250px]">
//               <img
//                 src={
//                   loginUser.id == selectedChat.users[0].id
//                     ? selectedChat.users[1].image
//                     : selectedChat.users[0].image
//                 }
//                 alt={
//                   loginUser.id == selectedChat.users[0].id
//                     ? selectedChat.users[1].name
//                     : selectedChat.users[0].name
//                 }
//                 className="w-44 h-44 rounded-full mb-4"
//               />
//               <p className="text-xl font-semibold">
//                 {loginUser.id == selectedChat.users[0].id
//                   ? selectedChat.users[1].name
//                   : selectedChat.users[0].name}
//               </p>
//               <p className="text-sm text-gray-600">
//                 {loginUser.id == selectedChat.users[0].id
//                   ? selectedChat.users[1].name
//                   : selectedChat.users[0].name}
//               </p>
//             </div>
//           </>
//         )}
//       </Modal>
//       <div className="mx-2 border border-red-950 h-96">
//         {chatId && <ScrollableChatBox chatId={chatId} />}
//       </div>
//     </>
//   );
// };

// export default ChatBox;


import React, { useCallback, useEffect, useRef, useState } from "react";
import ScrollableChatBox from "./ScrollableChatBox";
import { useChatContext } from "../context/ChatProviderContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AxiosInstance } from "../api/apiInstance";
import Cookies from "js-cookie";

const ChatBox = ({ selectedChat }) => {
  const [chatId, setChatId] = useState(null);
  const [groupMembers, setGroupMember] = useState(null);
  const [friends, setFriends] = useState(null);
  const { loginUser } = useChatContext();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const token = Cookies.get("token") || "";

  const prevGroupMembers = useRef(groupMembers);

  useEffect(() => {
    if (selectedChat) {
      setChatId(selectedChat.id);
    }
    if (selectedChat.isGroupChat) {
      setGroupMember(selectedChat.users);
      fetchFriends();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (prevGroupMembers.current !== groupMembers) {
      prevGroupMembers.current = groupMembers;
    }
  }, [groupMembers]);

  const fetchFriends = useCallback(async () => {
    try {
      const response = await AxiosInstance.get(`/chat/all-chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFriends(response.data.data.filter((chat) => !chat.isGroupChat));
    } catch (error) {
      console.error("Error fetching chats", error);
    }
  }, [token]);

  const onAddToGroup = async (users) => {
    const userId = loginUser.id === users[0].id ? users[1].id : users[0].id;
    try {
      const response = await AxiosInstance.post(
        `/chat/add-member`,
        { groupId: chatId, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroupMember(response.data.data);
      setIsProfileModalOpen(false); // Close modal
      setTimeout(() => setIsProfileModalOpen(true), 0); // Reopen modal to trigger re-render
    } catch (error) {
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
    }
  };

  const handleDelete = useCallback(
    async (userId) => {
      try {
        const response = await AxiosInstance.post(
          `/chat/remove-member`,
          { groupId: chatId, userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGroupMember(response.data.data);
      } catch (error) {
        console.error("not deleted", error.response.data.error);
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
      }
    },
    [chatId, token]
  );

  return (
    <>
      <div
        className="flex justify-between m-2 border border-red-950 text-center items-center rounded-md"
        onClick={() => setIsProfileModalOpen(true)}
      >
        {selectedChat.isGroupChat ? (
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
              {loginUser.id === selectedChat.users[0].id
                ? selectedChat.users[1].name
                : selectedChat.users[0].name}
            </h1>
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
              className="w-10 h-10 rounded-full mr-4 hover:cursor-pointer"
            />
          </>
        )}
      </div>
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      >
        {selectedChat.isGroupChat ? (
          <>
            <div className="flex flex-col items-center w-[350px] h-[350px]">
              <div className="border flex justify-between w-full items-center ">
                <img
                  src={selectedChat?.groupImage}
                  alt={selectedChat?.chatName}
                  className="w-16 h-16 rounded-full"
                />
                <p className="text-xl font-semibold">{selectedChat.chatName}</p>
              </div>
              <p className=" text-left p-1 bg-slate-600 font-bold text-x text-slate-200 rounded-xl">
                Group members
              </p>
              <div className="w-full flex flex-wrap justify-between  p-1">
                {groupMembers?.length > 0 &&
                  groupMembers.map((user) => (
                    <div
                      key={user.id}
                      className="flex mt-2 border p-1 rounded-md justify-between items-center w-[30%] h-7"
                    >
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-7 h-7 rounded-full "
                      />
                      <p className="text-x font-normal">{user.name}</p>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))}
              </div>
              <p className="text-left p-1 bg-slate-600 font-bold text-x text-slate-200 rounded-xl">
                Add new member
              </p>
              <div className="w-full flex flex-wrap justify-between  p-1">
                {friends &&
                  friends.map((chat) => {
                    return (
                      <div
                        key={chat.id}
                        className="flex mt-2 border p-1 rounded-md justify-between items-center w-[30%] h-7"
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
                          className="w-7 h-7 rounded-full"
                        />

                        <p className="text-x font-normal">
                          {loginUser.id === chat.users[0].id
                            ? chat.users[1].name
                            : chat.users[0].name}
                        </p>

                        <button
                          onClick={() => onAddToGroup(chat.users)}
                          className="ml-2 text-green-500 hover:text-green-700"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center w-[350px] h-[250px]">
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
                className="w-44 h-44 rounded-full mb-4"
              />
              <p className="text-xl font-semibold">
                {loginUser.id === selectedChat.users[0].id
                  ? selectedChat.users[1].name
                  : selectedChat.users[0].name}
              </p>
              <p className="text-sm text-gray-600">
                {loginUser.id === selectedChat.users[0].id
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
