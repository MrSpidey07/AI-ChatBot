import express from "express";
import {
  getChatHistory,
  getChatSessions,
  createChat,
} from "../controller/chat.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//New Chat or Continue Chat
router.post("/chat", protectedRoute, createChat);

//Get Chat Sessions by UserId
router.get("/chats/s", protectedRoute, getChatSessions);

//Get Chat by Id
router.post("/chat/c/:chatId", protectedRoute, getChatHistory);

export default router;
