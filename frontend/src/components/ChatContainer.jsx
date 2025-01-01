import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageContent from "./MessageContent";
import { ArrowDown } from "lucide-react";

const ChatContainer = () => {
  const {
    selectedChat,
    getMessages,
    isMessageLoading,
    messages,
    setSelectedChat,
  } = useChatStore();

  const chatEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Detect if the user is at the bottom
  const checkIfAtBottom = () => {
    const chatContainer = chatEndRef.current?.parentNode;
    if (chatContainer) {
      const { scrollHeight, scrollTop, clientHeight } = chatContainer;
      setShowScrollButton(scrollHeight - scrollTop !== clientHeight);
    }
  };

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

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onScroll={checkIfAtBottom}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat ${
              message.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-header mb-1">
              <span className="text-sm font-medium">
                {message.role === "user" ? "You" : "Eliora-AI"}
              </span>
              <time className="text-xs opacity-50 ml-1">
                {new Date(message.timestamp).toTimeString().split(" ")[0]}
              </time>
            </div>
            <div className="chat-bubble">
              <MessageContent content={message.content} />
            </div>
          </div>
        ))}
        <div ref={chatEndRef} /> {/* Reference for scrolling */}
      </div>
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed z-50 bottom-20 right-4 sm:right-8 md:right-12 
                 btn btn-circle btn-primary shadow-lg
                 transition-opacity duration-300 hover:scale-110"
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={20} />
        </button>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
