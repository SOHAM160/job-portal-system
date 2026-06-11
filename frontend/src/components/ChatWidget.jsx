import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getConversations, getMessages, sendMessageApi } from "../api/chat";
import io from "socket.io-client";
import { format } from "date-fns";

const ENDPOINT = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Initialize Socket
    socket.current = io(ENDPOINT, {
      withCredentials: true,
    });

    socket.current.emit("setup", user);
    socket.current.on("connected", () => setSocketConnected(true));

    socket.current.on("user online", (userId) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    socket.current.on("user offline", (userId) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    socket.current.on("message recieved", (newMessageRecieved) => {
      if (
        selectedChat &&
        selectedChat.conversationId === newMessageRecieved.conversationId
      ) {
        setMessages((prev) => [...prev, newMessageRecieved]);
        scrollToBottom();
      } else {
        // Handle unread indicator logic here (could add to conversations state)
        fetchConversations();
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user, selectedChat]);

  // Listen for global open-chat events
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  const fetchConversations = async () => {
    try {
      const { data } = await getConversations();
      setConversations(data.conversations);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchConversations();
    }
  }, [isOpen, user]);

  const fetchMessages = async (chat) => {
    if (!chat) return;
    try {
      const { data } = await getMessages(chat._id);
      setMessages(data.messages);
      socket.current.emit("join chat", chat._id);
      scrollToBottom();
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat);
  };

  const sendMessage = async (e) => {
    if (e.key && e.key !== "Enter") return;
    if (!newMessage.trim()) return;

    // Receiver is the other participant in the chat
    const receiver = selectedChat.participants.find(
      (p) => String(p._id) !== String(user?._id)
    );

    if (!receiver) return;

    try {
      const { data } = await sendMessageApi(receiver._id, newMessage);
      socket.current.emit("new message", data.message);
      setMessages([...messages, data.message]);
      setNewMessage("");
      scrollToBottom();
      fetchConversations(); // refresh latest message
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 text-white p-4 rounded-full shadow-2xl hover:bg-primary-700 transition-transform transform hover:scale-105"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[350px] md:w-[400px] h-[550px] flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-primary-600 p-4 text-white flex justify-between items-center shadow-md z-10">
            {selectedChat ? (
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setSelectedChat(null)}>
                <button className="text-white hover:text-primary-200 text-sm font-semibold">← Back</button>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {selectedChat.participants.find(p => p._id !== user._id)?.name}
                  </span>
                  <span className="text-xs text-primary-200">
                    {onlineUsers.has(selectedChat.participants.find(p => p._id !== user._id)?._id) ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            ) : (
              <h3 className="font-bold text-lg tracking-wide">Messages</h3>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
            {!selectedChat ? (
              // Conversations List
              <div className="overflow-y-auto h-full p-2 space-y-1">
                {conversations.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <MessageSquare className="w-10 h-10 text-gray-300 mb-3" />
                    <p>No messages yet.</p>
                  </div>
                ) : (
                  conversations.map((chat) => {
                    const otherUser = chat.participants.find((p) => String(p._id) !== String(user?._id));
                    if (!otherUser) return null;
                    const isOnline = onlineUsers.has(otherUser._id);

                    return (
                      <div
                        key={chat._id}
                        onClick={() => handleSelectChat(chat)}
                        className="p-3 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors flex items-center space-x-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="relative">
                          {otherUser.profilePhoto ? (
                            <img src={otherUser.profilePhoto} alt="profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                              {otherUser.name.charAt(0)}
                            </div>
                          )}
                          {isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-semibold text-gray-800 text-sm truncate">{otherUser.name}</h4>
                          <p className="text-xs text-gray-500 truncate">
                            {chat.lastMessage ? chat.lastMessage.text : "Say hi!"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              // Chat Interface
              <div className="flex-1 flex flex-col h-full relative">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, idx) => {
                    const senderId = msg.sender?._id || msg.sender;
                    const isMe = String(senderId) === String(user?._id);
                    return (
                      <div key={msg._id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe ? "bg-primary-600 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"}`}>
                          <p>{msg.text}</p>
                          <span className={`text-[10px] block mt-1 ${isMe ? "text-primary-200 text-right" : "text-gray-400 text-left"}`}>
                            {format(new Date(msg.createdAt), "HH:mm")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                {/* Input Area */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={sendMessage}
                    className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-primary-500 rounded-full py-2 px-4 text-sm outline-none transition-all"
                  />
                  <button onClick={sendMessage} className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
