import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Send } from "lucide-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const { sendMessage, isMessagesLoading, selectedChat } = useChatStore();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || isMessagesLoading) return;

    try {
      await sendMessage(text.trim());
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
      //toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="p-4 w-full">
      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder={
              selectedChat
                ? "Replay to this chat..."
                : "How can I help you today?"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isMessagesLoading}
          />
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle w-11 h-11"
          disabled={!text.trim() || isMessagesLoading}
        >
          {isMessagesLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <Send size={22} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
