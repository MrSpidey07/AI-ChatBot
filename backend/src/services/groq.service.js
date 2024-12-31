import { Groq } from "groq-sdk";
import { config } from "dotenv";
config();

export class GroqService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async generateChatResponse(messages) {
    try {
      const response = await this.groq.chat.completions.create({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        max_tokens: 2048,
        top_p: 1,
        stream: false,
        stop: null,
      });

      return response.choices[0]?.message?.content || "No response";
    } catch (error) {
      console.error("Error generating chat response:", error);
      throw new Error("Failed to generate AI response");
    }
  }

  async generateChatTitle(message) {
    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Generate a very brief, concise title (max 40 characters) that captures the main topic or question from the user's message. Don't use quotes and answer to the question as title. Respond with just the title.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null,
      });

      return response.choices[0]?.message?.content?.trim() || "New Chat";
    } catch (error) {
      console.error("Error generating chat title:", error);
      return "New Chat";
    }
  }
}
