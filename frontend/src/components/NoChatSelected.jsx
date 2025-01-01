import { Bot } from "lucide-react";
import MessageInput from "./MessageInput";

const NoChatSelected = () => {
  return (
    <div className="w-full flex-1 flex flex-col bg-base-100/50 min-h-0">
      {/* Center content with pointer-events-none to allow clicking through */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          {/* Icon Display */}
          <div className="flex justify-center gap-4 mb-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
                <Bot className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <h2 className="text-xl sm:text-2xl font-bold">
            Welcome to Eliora Chat!
          </h2>
          <p className="text-base-content/60 text-sm sm:text-base">
            Developed By Meet Bodana
          </p>
        </div>
      </div>

      {/* Message Input with pointer-events-auto to ensure it's clickable */}
      <div className="shrink-0">
        <MessageInput />
      </div>
    </div>
  );
};

export default NoChatSelected;
