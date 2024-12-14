import express from "express";
import dotenv from "dotenv";
import chatbotRouter from "./routes/chatBot.routes.js";
import authRouter from "./routes/auth.routes.js";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const port = process.env.PORT;
const app = express();

//Middelwares
//app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

//Routes
app.use("/api/auth", authRouter);
app.use("/api/chat", chatbotRouter);

//Homepage
// app.get("/", (req, res) => {
//   res.render("index");
// });

app.listen(port, () => {
  console.log("Server is running on port http://localhost:" + port);
  connectDB();
});
