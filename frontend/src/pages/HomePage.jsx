import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import { useEffect } from "react";

const HomePage = () => {
  const { selectedChat, noChatSessions, getChats } = useChatStore();

  useEffect(() => {
    getChats();
  }, [getChats]);

  return (
    <div className="h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content">
          {/* Main Content */}
          <div className="flex items-center justify-center pt-20 px-4">
            <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-screen-xl h-[calc(100vh-6rem)]">
              <div className="flex h-full rounded-lg overflow-hidden">
                {/* Show sidebar only on large screens */}
                {!noChatSessions && (
                  <div className="hidden lg:block">
                    <Sidebar />
                  </div>
                )}

                {!selectedChat ? <NoChatSelected /> : <ChatContainer />}
              </div>
            </div>
          </div>
        </div>

        {/* Drawer sidebar for mobile/tablet */}
        <div className="drawer-side z-30">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          {!noChatSessions && <Sidebar className="lg:hidden" />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
