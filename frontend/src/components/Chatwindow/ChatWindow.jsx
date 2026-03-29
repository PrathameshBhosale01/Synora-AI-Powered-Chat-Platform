// import React, { useContext, useState, useEffect, useRef } from "react"; // Import useRef
// import Chat from "../Chat/Chat.jsx";
// import "./ChatWindow.css";
// import { MyContext } from "../../context/MyContext.jsx";
// import { BeatLoader } from "react-spinners";
// import { useNavigate } from "react-router-dom";

// function ChatWindow() {
//   const navigate = useNavigate();
//   const {
//     prompt,
//     setPrompt,
//     setReply,
//     currThreadId,
//     setPrevChats,
//     setNewchat,
//   } = useContext(MyContext);
//   const [loading, setLoading] = useState(false);
//   const [showdropdown, setShowdropdown] = useState(false);

//   //Create a reference to the bottom of the chat list
//   const bottomRef = useRef(null);

//   const toggleDropdown = () => setShowdropdown(!showdropdown);

//   const handleLogout = async () => {
//     try {
//       await fetch("http://localhost:5000/api/auth/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//       navigate("/login");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const getReply = async () => {
//     if (!prompt.trim()) return;

//     const userMessage = prompt; // Store current message
//     setPrompt(""); //  Clear Input IMMEDIATELY

//     setLoading(true);
//     setNewchat(false);

//     // Add user message to chat list
//     setPrevChats((prev) => [...prev, { role: "user", content: userMessage }]);

//     const options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({
//         message: userMessage, // Use stored variable
//         threadId: currThreadId,
//       }),
//     };

//     try {
//       const response = await fetch("http://localhost:5000/api/chat", options);
//       const data = await response.json();
//       // Add AI response to chat list
//       setPrevChats((prev) => [
//         ...prev,
//         { role: "assistant", content: data.success },
//       ]);
//       setReply(data.success); // Trigger typing effect if needed
//     } catch (err) {
//       console.log(err);
//     }
//     setLoading(false);
//   };

//   // Auto-Scroll Effect: triggers on loading change or new messages
//   useEffect(() => {
//     if (bottomRef.current) {
//       bottomRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [loading, setPrevChats]); // Scroll when loading starts OR chats update

//   return (
//     <div className="chatwindow">
//       <div className="navbar">
//         <span className="brand">
//           Synora <span className="version">2.0</span>
//         </span>
//         <div className="userIconDiv" style={{ position: "relative" }}>
//           <span className="userIcon" onClick={toggleDropdown}>
//             <i className="fa-solid fa-user"></i>
//           </span>
//           {showdropdown && (
//             <div className="profile-dropdown">
//               <div className="dropdown-item">Edit Profile</div>
//               <div className="dropdown-item logout" onClick={handleLogout}>
//                 Logout <i className="fa-solid fa-right-from-bracket"></i>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="main-content">
//         <Chat />

//         {/* Loader appears here, inside the scrollable area */}
//         {loading && (
//           <div className="loading-container">
//             <BeatLoader color="#fff" height={20} />
//           </div>
//         )}

//         {/*Invisible Anchor Div to scroll to */}
//         <div ref={bottomRef} />
//       </div>

//       <div className="chatInput">
//         <div className="inputBox">
//           <input
//             type="text"
//             placeholder="Ask anything"
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//             onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
//           />

//           <div id="submit" onClick={getReply}>
//             <i className="fa-solid fa-paper-plane"></i>
//           </div>
//         </div>
//         <p className="info">
//           Synora can make mistakes. Check important info.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default ChatWindow;
import React, { useContext, useState, useEffect, useRef } from "react";
import Chat from "../Chat/Chat.jsx";
import "./ChatWindow.css";
import { MyContext } from "../../context/MyContext.jsx";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function ChatWindow() {
  const navigate = useNavigate();
  const {
    prompt,
    setPrompt,
    setReply,
    currThreadId,
    setPrevChats,
    setNewchat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [showdropdown, setShowdropdown] = useState(false);

  // 🎤 Voice states
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const isListeningRef = useRef(false);
  const startTimeRef = useRef(null);
  const LISTEN_TIMEOUT_MS = 10000;

  const textareaRef = useRef(null);

  // Scroll ref
  const bottomRef = useRef(null);

  const toggleDropdown = () => setShowdropdown(!showdropdown);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleInput = (e) => {
    setPrompt(e.target.value);

    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  //text input
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [prompt]);


  // 🎤 Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = true;

    rec.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (final) {
        finalTranscriptRef.current +=
          (finalTranscriptRef.current ? " " : "") + final;
      }

      setPrompt(
        (finalTranscriptRef.current + (interim ? " " + interim : "")).trim()
      );
    };

    rec.onstart = () => {
      setIsListening(true);
      isListeningRef.current = true;

      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
    };

    rec.onend = () => {
      if (!isListeningRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;

      if (elapsed < LISTEN_TIMEOUT_MS) {
        try {
          rec.start();
        } catch {
          stopListening();
        }
      } else {
        stopListening();
      }
    };

    rec.onerror = (e) => {
      console.error("Speech error:", e.error);
      stopListening();
    };

    recognitionRef.current = rec;

    return () => {
      rec.abort();
    };
  }, []);

  const stopListening = () => {
    isListeningRef.current = false;
    startTimeRef.current = null;
    setIsListening(false);
    try {
      recognitionRef.current?.stop();
    } catch { }
  };

  const toggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      finalTranscriptRef.current = prompt;
      startTimeRef.current = null;
      isListeningRef.current = true;
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Mic start error:", e);
      }
    }
  };

  const getReply = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setPrompt("");

    stopListening(); // stop mic when sending

    setLoading(true);
    setNewchat(false);

    setPrevChats((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        message: userMessage,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("http://localhost:5000/api/chat", options);
      const data = await response.json();

      setPrevChats((prev) => [
        ...prev,
        { role: "assistant", content: data.success },
      ]);

      setReply(data.success);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [loading, prompt]);

  return (
    <div className="chatwindow">
      <div className="navbar">
        <span className="brand">
          Synora <span className="version">2.0</span>
        </span>

        <div className="userIconDiv" style={{ position: "relative" }}>
          <span className="userIcon" onClick={toggleDropdown}>
            <i className="fa-solid fa-user"></i>
          </span>

          {showdropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item">Edit Profile</div>
              <div className="dropdown-item logout" onClick={handleLogout}>
                Logout <i className="fa-solid fa-right-from-bracket"></i>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="main-content">
        <Chat />

        {loading && (
          <div className="loading-container">
            <BeatLoader color="#fff" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chatInput">
        <div className="inputBox">
          {/* 🎤 Mic Icon */}
          <div className={`micIcon ${isListening ? "listening" : ""}`} onClick={toggleListen}>
            <i className="fa-solid fa-microphone"></i>
          </div>

          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={isListening ? "Listening..." : "Ask anything"}
            value={prompt}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                getReply();
              }
            }}
          />

          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          Synora can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;