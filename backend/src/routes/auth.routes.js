import express from "express";
import {
  login,
  register,
  logout,
  forgotPassword,
  checkAuth,
} from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/alive", (req, res) => {
  res.status(200).json({ message: "Server is alive" });
});

router.post("/login", login);

router.post("/signup", register);

router.post("/forgot-password", forgotPassword);

router.post("/logout", logout);

router.get("/check", protectedRoute, checkAuth);

export default router;
