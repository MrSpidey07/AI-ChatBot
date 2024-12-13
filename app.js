import express from "express";
import dotenv from "dotenv";
import chatbotRouter from "./routes/chatBot.routes.js";
dotenv.config();

const app = express();

//Middelwares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/chat", chatbotRouter);

//Homepage
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
