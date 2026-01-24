import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendOtp } from "../services/mail.service.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //generateToken(user._id, res);
    const token = generateToken(user._id);

    return res.status(200).json({ message: "User login Succesfull", token });
  } catch (error) {
    console.log("Error in Login", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //Check Password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    //Send OTP
    const otp = await sendOtp(email);

    if(otp == null){
      return res.status(400).json({ message: "Error sending OTP" });
    }

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create new user
    const newUser = new User({
      fullname: fullName,
      email: email,
      password: hashedPassword,
      opt: otp,
      optExpiry: otpExpiry,
      isVerified: false,
    });

    if (newUser) {
      await newUser.save();
      res.status(201).json({ message: "OTP Sent successfully" });
    } else {
      res.status(400).json({ message: "Error creating user" });
    }

  } catch (error) {
    console.log("Error in register", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    if (user.opt !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.optExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    
    user.isVerified = true;
    user.opt = undefined;
    user.optExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("Error in verifyOtp", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    const otp = await sendOtp(email);
    if (otp == null) {
      return res.status(400).json({ message: "Error sending OTP" });
    }
    user.opt = otp;
    user.optExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("Error in resendOtp", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    //res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Loged Out Succesfully" });
  } catch (error) {
    console.log("Logout Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in Chech Auth Controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
