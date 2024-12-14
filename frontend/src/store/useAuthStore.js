import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,

  isSigningUp: false,
  isLogingIn: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      // Log the request for debugging
      console.log("Starting auth check...");

      const res = await axiosInstance.get("/auth/check");

      // Log the response data
      console.log("Auth check successful:", res.data);

      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
      console.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      set({ isCheckingAuth: false });
      console.log("Auth check complete.");
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account Created Successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully");
    } catch (error) {
      console.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  },

  login: async (data) => {
    set({ isLogingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged In Successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      set({ isLogingIn: false });
    }
  },
}));
