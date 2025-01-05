import { Routes, Route } from "react-router-dom";
import SignUp from "./components/Auth/SignUp";
import Login from "./components/Auth/Login";
import ChatPage from "./pages/ChatPage";
import PrivateRoute from "./components/Auth/PrivateRoute";
import NotFoundPage from "./pages/NotFoundPage";

import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="" element={<ChatPage />} />
        </Route>

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
