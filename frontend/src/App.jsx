import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import ChatWindow from "./components/Chatwindow/ChatWindow.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { MyContext } from "./context/MyContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewchat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValue = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewchat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
  };

  return (
    <div>
      <MyContext.Provider value={providerValue}>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <div className="app">
                  <Sidebar />
                  <ChatWindow />
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </MyContext.Provider>
    </div>
  );
}

export default App;
