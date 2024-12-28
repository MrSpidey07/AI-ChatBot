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

// router.post("/send", async (req, res) => {
//   const message = req.body.message.trim();
//   const completion = await groq.chat.completions.create({
//     messages: [
//       {
//         role: "user",
//         content: message,
//       },
//     ],
//     model: "llama3-8b-8192",
//   });

//   const response = completion.choices[0].message.content;
//   res.render("chatArea", { response });
// });

export default router;
