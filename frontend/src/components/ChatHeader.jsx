import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedChat, setSelectedChat } = useChatStore();

  return (
    <div className="p-2.5 border-b border-base-300 min-h-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* User info */}
          <div className="flex items-center p-2.5">
            <h3 className="font-medium">{selectedChat.title}</h3>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedChat(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
