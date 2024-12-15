import Chat from "../models/chat.model.js";
import { v4 as uuidv4 } from "uuid";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

//TO-DO: Add Dynamic Title , Real-time Update Socket.io and Model Testing

export const createChat = async (req, res) => {
  const { userId, chatId, message } = req.body;

  try {
    if (!userId || !message) {
      return res
        .status(400)
        .json({ message: "Please provide userId and message" });
    }

    let chatSession;

    if (chatId) {
      chatSession = await Chat.findOne({ chatId, userId });

      if (!chatSession) {
        return res.status(400).json({ message: "Chat session not found" });
      }
    } else {
      const newChatId = uuidv4();
      chatSession = chatSession = new Chat({
        chatId: newChatId,
        userId,
        messages: [],
        title: "New Chat",
      });
    }

    chatSession.messages.push({ role: "user", content: message });

    const groq = new Groq({
      apiKey: process.env.GROQ_KEY,
    });

    const groqResponse = await groq.chat.completions.create({
      messages: chatSession.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      model: "llama3-8b-8192",
    });

    const aiResponse =
      groqResponse.choices[0]?.message?.content || "No response";

    chatSession.messages.push({ role: "assistant", content: aiResponse });

    await chatSession.save();

    res.status(200).json({
      chatId: chatSession.chatId,
      messages: chatSession.messages,
      title: chatSession.title,
    });
  } catch (error) {
    console.error("Error in chat.controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getChatSessions = async (req, res) => {
  const userId = req.user._id.toString();

  try {
    if (!userId) {
      return res.status(400).json({ message: "Please provide userId" });
    }

    const chatSessions = await Chat.find({ userId }, "chatId title updatedAt", {
      sort: { updatedAt: -1 },
    });
    // const chatSessions = await Chat.find({ userId }).select(
    //   "chatId title createdAt updatedAt"
    // );

    if (!chatSessions || chatSessions.length === 0) {
      return res.status(404).json({ message: "No chat sessions found" });
    }

    res.status(200).json(chatSessions);
  } catch (error) {
    console.error("Error in /chat/s", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getChatHistory = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id.toString();

  try {
    if (!chatId || !userId) {
      return res
        .status(400)
        .json({ message: "Chat ID and User ID are required." });
    }

    const chatSession = await Chat.findOne({
      chatId,
      userId: userId,
    });

    if (!chatSession) {
      return res
        .status(404)
        .json({ message: "Chat session not found or access denied." });
    }

    res.status(200).json(chatSession);
  } catch (error) {
    console.error("Error in /c/:chatId:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
