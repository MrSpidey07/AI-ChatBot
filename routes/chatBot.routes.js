import Groq from "groq-sdk";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_KEY,
});
const router = express.Router();

router.get("/", (req, res) => {
  res.render("chatArea", { response: null });
});

router.post("/send", async (req, res) => {
  const message = req.body.message.trim();
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    model: "llama3-8b-8192",
  });

  const response = completion.choices[0].message.content;
  res.render("chatArea", { response });
});

export default router;
