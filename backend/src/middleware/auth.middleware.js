import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const checkToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!checkToken) {
      return res.status(401).json({ message: "Internal Server Error" });
    }

    const user = await User.findById(checkToken.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in Auth Middelware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
