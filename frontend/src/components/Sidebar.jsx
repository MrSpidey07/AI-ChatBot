import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";
import SideBarSkeleton from "./skeletons/SideBarSkeleton";
import { LucideEllipsis, MessageSquare, SquarePlus } from "lucide-react";

const Sidebar = () => {
  const { chats, setSelectedChat, selectedChat, isChatsLoading } =
    useChatStore();

  if (isChatsLoading) return <SideBarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-6" />
            <span className="font-medium hidden lg:block">Chats</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="size-6 cursor-pointer"
              onClick={() => {
                setSelectedChat(null);
              }}
            >
              <SquarePlus />
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
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-normal truncate">{chat.title}</div>
            </div>
            <button onClick={(e) => e.stopPropagation()}>
              <LucideEllipsis
                className="size-5"
                onClick={() => {
                  toast("Coming Soon!", { icon: "🚀" });
                }}
              />
            </button>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
