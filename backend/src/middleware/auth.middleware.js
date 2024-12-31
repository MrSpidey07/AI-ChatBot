import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const checkToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!checkToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(checkToken.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in Auth Middelware", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};
