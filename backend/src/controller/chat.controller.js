// controllers/chat.controller.js
import { ChatService } from "../services/chat.service.js";
import { handleError, ChatError } from "../utils/error.handler.js";

const chatService = new ChatService();

// Get all chat sessions for a user
export const getChatSessions = async (req, res) => {
  const userId = req.user._id.toString();

  try {
    if (!userId) {
      throw new ChatError("Please provide userId", 400);
    }

    const chatSessions = await chatService.getUserChats(userId);

    if (!chatSessions || chatSessions.length === 0) {
      throw new ChatError("No chat sessions found", 404);
    }

    res.status(200).json(chatSessions);
  } catch (error) {
    handleError(error, res);
  }
};

// Get chat history for a specific chat
export const getChatHistory = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id.toString();

  try {
    if (!chatId || !userId) {
      throw new ChatError("Chat ID and User ID are required", 400);
    }

    const chatSession = await chatService.getChatById(userId, chatId);

    if (!chatSession) {
      throw new ChatError("Chat session not found or access denied", 404);
    }

    res.status(200).json(chatSession);
  } catch (error) {
    handleError(error, res);
  }
};

// Create new chat or add message to existing chat
export const createChat = async (req, res) => {
  const userId = req.user._id.toString();
  const { chatId, message } = req.body;

  try {
    if (!userId || !message) {
      throw new ChatError("Please provide userId and message", 400);
    }

    // Get or create chat session
    let chatSession = await chatService.findOrCreateChat(userId, chatId);

    // For new chats, generate title
    if (!chatId) {
      chatSession.title = await chatService.generateTitle(message);
    }

    // Process message and get AI response
    chatSession = await chatService.processUserMessage(chatSession, message);

    // Save updated chat
    await chatSession.save();

    res.status(200).json({
      chatId: chatSession.chatId,
      messages: chatSession.messages,
      title: chatSession.title,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Update chat title
export const updateChatTitle = async (req, res) => {
  const userId = req.user._id.toString();
  const { chatId, title } = req.body;

  try {
    if (!chatId || !title) {
      throw new ChatError("Chat ID and title are required", 400);
    }

    const updatedChat = await chatService.updateChatTitle(
      userId,
      chatId,
      title
    );

    res.status(200).json({
      chatId: updatedChat.chatId,
      title: updatedChat.title,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Delete chat session
export const deleteChat = async (req, res) => {
  const userId = req.user._id.toString();
  const { chatId } = req.params;

  try {
    if (!chatId) {
      throw new ChatError("Chat ID is required", 400);
    }

    await chatService.deleteChat(userId, chatId);

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    handleError(error, res);
  }
};
