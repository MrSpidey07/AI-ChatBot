import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";
import SideBarSkeleton from "./skeletons/SideBarSkeleton";
import PropTypes from "prop-types";
import { LucideEllipsis, MessageSquare, SquarePlus } from "lucide-react";

const Sidebar = ({ className = "" }) => {
  const { chats, setSelectedChat, selectedChat, isChatsLoading } =
    useChatStore();

  if (isChatsLoading) return <SideBarSkeleton />;

  return (
    <aside
      className={`h-full w-80 border-r border-base-300 flex flex-col bg-base-100 ${className}`}
    >
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-6" />
            <span className="font-medium">Chats</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSelectedChat(null)}
            >
              <SquarePlus className="size-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {chats.map((chat) => (
          <button
            key={chat.chatId}
            onClick={() => setSelectedChat(chat)}
            className={`
              w-full p-3 flex items-center gap-3 justify-between
              hover:bg-base-300 transition-colors
              ${
                selectedChat?.chatId === chat.chatId
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="text-left min-w-0">
              <div className="font-normal truncate">{chat.title}</div>
            </div>
            <button
              className="btn btn-ghost btn-sm p-2"
              onClick={(e) => {
                e.stopPropagation();
                toast("Coming Soon!", { icon: "🚀" });
              }}
            >
              <LucideEllipsis className="size-5" />
            </button>
          </button>
        ))}
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string.isRequired,
};

export default Sidebar;
