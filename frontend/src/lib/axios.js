import axios from "axios";
import { auth } from "./firebase";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: false,
});

// Request interceptor to add Firebase token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get current Firebase user
      const user = auth.currentUser;

      if (user) {
        // Get fresh token
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting Firebase token:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
