import { Navbar } from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AuthAction from "./pages/AuthAction";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, isCheckingAuth, initializeAuthListener } = useAuthStore();

  useEffect(() => {
    // Initialize Firebase auth state listener
    initializeAuthListener();
  }, [initializeAuthListener]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <Navbar></Navbar>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/forgot-password"
          element={!authUser ? <ForgotPassword /> : <Navigate to="/" />}
        ></Route>
        {/* Firebase Action Handler - handles email verification & password reset */}
        <Route path="/auth/action" element={<AuthAction />}></Route>
      </Routes>

      <Toaster></Toaster>
    </div>
  );
};

export default App;
