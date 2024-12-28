import { MessageSquare } from "lucide-react";

const SideBarSkeleton = () => {
  const skeletonChats = Array(8).fill(null);

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-300 
    flex flex-col transition-all duration-200"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Chats</span>
        </div>
      </div>

      {/* Skeleton Chats */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonChats.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* User info skeleton - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-44 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideBarSkeleton;
