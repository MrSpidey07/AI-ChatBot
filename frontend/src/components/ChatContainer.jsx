import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const {
    selectedChat,
    getMessages,
    isMessageLoading,
    messages,
    setSelectedChat,
  } = useChatStore();

  const chatEndRef = useRef(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    getMessages(selectedChat.chatId);
  }, [selectedChat.chatId, getMessages]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedChat(null); // Call the method to close the chat
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setSelectedChat]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat ${
              message.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-header mb-1">
              <span className="text-sm font-medium">
                {message.role === "user" ? "You" : "Assistant"}
              </span>
              <time className="text-xs opacity-50 ml-1">
                {new Date(message.timestamp).toTimeString().split(" ")[0]}
              </time>
            </div>
            <div className="chat-bubble">
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} /> {/* Reference for scrolling */}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
