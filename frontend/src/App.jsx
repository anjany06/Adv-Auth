import React from "react";
import { Route, Routes, } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />}></Route>
        <Route path="/reset-password" element={<ResetPassword />}></Route>
      </Routes>
    </div>
  );
};

export default App;
