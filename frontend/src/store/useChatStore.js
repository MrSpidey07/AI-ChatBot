import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
  messages: [],
  noChatSessions: true,
  selectedChat: null,
  chats: [],
  isMessagesLoading: false,
  isChatsLoading: false,

  getChats: async () => {
    set({ isChatsLoading: true });
    try {
      const res = await axiosInstance.get("/chats/s");
      set({ chats: res.data, noChatSessions: res.data.length === 0 });
    } catch (error) {
      set({ noChatSessions: true });
      if (
        error.response?.status === 404 &&
        error.response?.data?.message === "No chat sessions found"
      ) {
        console.log("No chat sessions found");
      } else {
        toast.error(error.response?.data?.message || "Failed to load chats");
        console.error("Failed to load chats:", error);
      }
    } finally {
      set({ isChatsLoading: false });
    }
  },

  getMessages: async (chatId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.post(`/chat/c/${chatId}`);
      set({ messages: res.data.messages || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (message) => {
    const { selectedChat, getChats } = get();
    const chatId = selectedChat?.chatId; // chatId might be null for new chat
    try {
      const res = await axiosInstance.post("/chat", { chatId, message });
      //set({ messages: [...messages, res.data] });
      set({
        messages: res.data.messages,
        selectedChat: {
          chatId: res.data.chatId,
          title: res.data.title,
        },
      });

      // Refresh the chats list to include new chat if created
      await getChats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  setSelectedChat: (chat) => {
    set({
      selectedChat: chat,
      messages: [], // Clear messages when switching chats
    });
    if (chat?.chatId) {
      get().getMessages(chat.chatId);
    }
  },

  clearMessages: () => set({ messages: [] }),
}));
