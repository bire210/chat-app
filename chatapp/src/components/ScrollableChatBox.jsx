/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../context/ChatProviderContext";
import { ToastContainer, toast } from "react-toastify";
import { FaPaperPlane, FaTrash } from "react-icons/fa";
import Cookies from "js-cookie";
import io from "socket.io-client";
import { AxiosInstance } from "../api/apiInstance";

const ENDPOINT = "https://chat-app-udbk.onrender.com";
// const ENDPOINT = "http://localhost:8000";
let socket;

const ScrollableChatBox = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [apiError, setApiError] = useState("");
  const { loginUser } = useChatContext();
  const chatEndRef = useRef(null);
  const token = Cookies.get("token") || "";

  const fetchChats = async () => {
    try {
      setApiError("");
      const response = await AxiosInstance.get(`/message/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(response.data.data);
      socket.emit("join chat", chatId);
    } catch (error) {
      setApiError(error.response.data.error);
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
    } finally {
      setApiError("");
    }
  };

  const clearCurrentChat = async () => {
    try {
      setApiError("");
      await AxiosInstance.delete(`chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([]);
    } catch (error) {
      setApiError(error.response.data.error);
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
    } finally {
      setApiError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await AxiosInstance.post(
        `/message/send`,
        { content: text, chatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket.emit("new message", response.data.data);
    } catch (error) {
      console.error("Error sending message", error);
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
    setText("");
  };

  useEffect(() => {
    fetchChats();
  }, [chatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket = io(ENDPOINT, { transports: ["websocket"] });
    socket.emit("setup", loginUser);

    socket.on("connect", () => {
      // console.log("Connected to server");
    });

    socket.on("connected", () => {
      console.log("Socket connected");
    });

    socket.on("message recieved", (newMessageRecieved) => {
      // console.log("new message", newMessageRecieved);
      setMessages((oldMessages) => [newMessageRecieved, ...oldMessages]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // console.log("reeeen*****************");
  }, [messages]);
  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      {/* Messages Section */}
      <div className="h-96 overflow-y-auto flex flex-col-reverse p-4 bg-gray-800 border border-gray-700 rounded-md shadow-inner">
        <div ref={chatEndRef}></div>
        {messages &&
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end mb-4 ${
                message.senderId === loginUser.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.senderId !== loginUser.id && (
                <img
                  src={message.sender.image}
                  alt={message.sender.name}
                  className="w-8 h-8 rounded-full mr-2 hover:cursor-pointer"
                />
              )}
              <div
                className={`max-w-xs break-words px-4 py-2 rounded-lg shadow-md ${
                  message.senderId === loginUser.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                {message.content}
              </div>
              {message.senderId === loginUser.id && (
                <img
                  src={loginUser.image}
                  alt={loginUser.name}
                  className="w-8 h-8 rounded-full ml-2 hover:cursor-pointer"
                />
              )}
            </div>
          ))}
      </div>

      {/* Input and Clear Chat Section */}
      <div className="flex flex-row items-center justify-between w-full mt-4">
        {/* Clear Chat Button */}
        <button
          onClick={clearCurrentChat}
          className="flex items-center text-red-500 hover:text-red-700 transition-colors duration-200"
        >
          <FaTrash className="mr-1" />
          Clear Chat
        </button>

        {/* Message Input Form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center w-[87%] border border-gray-600 bg-gray-700 rounded-full p-2 shadow-sm"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            className="flex-1 bg-gray-700 border-none outline-none p-2 text-lg text-gray-200 placeholder-gray-400 rounded-full"
          />
          <button
            type="submit"
            className="text-2xl text-blue-500 hover:text-blue-700 transition-colors duration-200 mx-2"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </>
  );
};

export default ScrollableChatBox;
