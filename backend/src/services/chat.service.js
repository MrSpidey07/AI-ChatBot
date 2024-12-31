// services/chat.service.js
import { v4 as uuidv4 } from "uuid";
import Chat from "../models/chat.model.js";
import { GroqService } from "./groq.service.js";
import { ChatError } from "../utils/error.handler.js";

export class ChatService {
  constructor() {
    this.groqService = new GroqService();
  }

  async getUserChats(userId) {
    try {
      return await Chat.find({ userId }, "chatId title updatedAt", {
        sort: { updatedAt: -1 },
      });
    } catch (error) {
      console.error("Error fetching user chats:", error);
      throw new ChatError("Failed to fetch chat sessions");
    }
  }

  async getChatById(userId, chatId) {
    try {
      return await Chat.findOne({ chatId, userId });
    } catch (error) {
      console.error("Error fetching chat:", error);
      throw new ChatError("Failed to fetch chat session");
    }
  }

  async findOrCreateChat(userId, chatId) {
    try {
      if (chatId) {
        const existingChat = await Chat.findOne({ chatId, userId });
        if (!existingChat) {
          throw new ChatError("Chat session not found", 404);
        }
        return existingChat;
      }

      return new Chat({
        chatId: uuidv4(),
        userId,
        messages: [],
        title: "New Chat",
      });
    } catch (error) {
      console.error("Error in findOrCreateChat:", error);
      throw new ChatError(error.message, error.statusCode || 500);
    }
  }

  async processUserMessage(chatSession, message) {
    try {
      const userMessage = {
        role: "user",
        content: message,
      };
      chatSession.messages.push(userMessage);

      const aiResponse = await this.groqService.generateChatResponse(
        chatSession.messages
      );

      const assistantMessage = {
        role: "assistant",
        content: aiResponse,
      };
      chatSession.messages.push(assistantMessage);

      return chatSession;
    } catch (error) {
      console.error("Error processing message:", error);
      throw new ChatError("Failed to process message");
    }
  }

  async generateTitle(message) {
    try {
      return await this.groqService.generateChatTitle(message);
    } catch (error) {
      console.error("Error generating title:", error);
      return "New Chat";
    }
  }

  async updateChatTitle(userId, chatId, title) {
    try {
      const chat = await Chat.findOne({ chatId, userId });
      if (!chat) {
        throw new ChatError("Chat not found", 404);
      }

      chat.title = title;
      return await chat.save();
    } catch (error) {
      console.error("Error updating chat title:", error);
      throw new ChatError(error.message, error.statusCode || 500);
    }
  }

  async deleteChat(userId, chatId) {
    try {
      const result = await Chat.deleteOne({ chatId, userId });
      if (result.deletedCount === 0) {
        throw new ChatError("Chat not found", 404);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      throw new ChatError(error.message, error.statusCode || 500);
    }
  }
}
