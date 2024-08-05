import { useState } from "react";

import { Routes, Route } from "react-router-dom";
import SignUp from "./components/Auth/SignUp";
import Login from "./components/Auth/Login";
import ChatPage from "./pages/ChatPage";
import PrivateRoute from "./components/Auth/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route Route path="/" element={<PrivateRoute />}>
        <Route path="" element={<ChatPage />} />
      </Route>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
