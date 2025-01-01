import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { Send } from "lucide-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const { sendMessage, isMessagesLoading, selectedChat } = useChatStore();
  const lastSubmissionTime = useRef(0);
  const SUBMISSION_DELAY = 1000; // 1 second cooldown between submissions

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Check if enough time has passed since last submission
    const now = Date.now();
    if (now - lastSubmissionTime.current < SUBMISSION_DELAY) {
      return;
    }

    if (!text.trim() || isMessagesLoading) return;

    try {
      lastSubmissionTime.current = now;
      await sendMessage(text.trim());
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
      //toast.error("Failed to send message. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // If shift+enter is pressed, add a newline
      if (e.shiftKey) {
        e.preventDefault();
        const cursorPosition = e.target.selectionStart;
        const textBeforeCursor = text.substring(0, cursorPosition);
        const textAfterCursor = text.substring(cursorPosition);
        setText(textBeforeCursor + "\n" + textAfterCursor);

        // Set cursor position after the new line
        setTimeout(() => {
          e.target.selectionStart = cursorPosition + 1;
          e.target.selectionEnd = cursorPosition + 1;
        }, 0);
      } else {
        // Regular enter press submits the form
        e.preventDefault();
        handleSendMessage(e);
      }
    }
  };

  const autoResizeTextarea = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className="w-full bg-base-100 border-t border-base-300 p-3 sm:p-4">
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 sm:gap-3 max-w-4xl mx-auto"
        onClick={(e) => e.stopPropagation()} // Stop event propagation
      >
        <div className="flex-1">
          <textarea
            className="w-full input input-bordered rounded-lg input-sm sm:input-md resize-none min-h-[40px] sm:min-h-[44px] pt-1 placeholder-opacity-70"
            placeholder={
              selectedChat
                ? "Reply to this chat..."
                : "How can I help you today?"
            }
            value={text}
            onChange={(e) => {
              e.stopPropagation(); // Stop event propagation
              setText(e.target.value);
              autoResizeTextarea(e);
            }}
            onKeyDown={(e) => {
              e.stopPropagation(); // Stop event propagation
              handleKeyDown(e);
            }}
            onClick={(e) => e.stopPropagation()} // Stop event propagation
            disabled={isMessagesLoading}
            rows={1}
            style={{
              height: "auto",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          />
        </div>
        <button
          type="submit"
          className="btn btn-sm sm:btn-md btn-circle"
          disabled={!text.trim() || isMessagesLoading}
          onClick={(e) => e.stopPropagation()} // Stop event propagation
        >
          {isMessagesLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <Send className="size-5 sm:size-6" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
