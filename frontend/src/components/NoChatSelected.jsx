import { Bot } from "lucide-react";
import MessageInput from "./MessageInput";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-between p-12 bg-base-100/50">
      <div className="max-w-md text-center space-y-4 mt-32">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-2">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <Bot className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to AI-Chatty!</h2>
        <p className="text-base-content/60">Developed By Meet Bodana</p>
      </div>

      <MessageInput />
    </div>
  );
};

export default NoChatSelected;
