import { useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import { MyContext } from "../../context/MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewchat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);
  const [extended, setExtended] = useState(false);
  const [modalType, setModalType] = useState(null); // Used for Help, Activity, Settings
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  // Apply light-mode class to body depending on isDarkMode
  useEffect(() => {
    if (!isDarkMode) {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    }
  }, [isDarkMode]);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/thread", {
        credentials: "include",
      });
      const res = await response.json();
      const fileterData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      // console.log(fileterData);
      setAllThreads(fileterData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const creatNewChat = () => {
    setNewchat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    setNewchat(false);
    try {
      const response = await fetch(
        `http://localhost:5000/api/thread/${newThreadId}`,
        {
          credentials: "include",
        }
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/thread/${threadId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const res = await response.json();
      console.log(res);
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );
      if (threadId === currThreadId) {
        creatNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <section className={`sidebar ${extended ? "open" : "collapsed"}`}>
        {/* Top Section: Toggle & New Chat */}
        <div className="top-section">
          {/* Hamburger Menu to Toggle Sidebar */}
          <div
            className="menu-icon"
            onClick={() => setExtended((prev) => !prev)}
          >
            <i className="fa-solid fa-bars"></i>
          </div>

          <div className="new-chat" onClick={creatNewChat}>
            <i className="fa-solid fa-plus"></i>
            {extended && <p>New Chat</p>}
          </div>
        </div>

        {/* History List - Only show if extended */}
        {extended && (
          <div className="history-container">
            <p className="history-title">Recent</p>
            <ul className="history-list">
              {allThreads?.map((thread, idx) => (
                <li
                  key={idx}
                  onClick={() => changeThread(thread.threadId)}
                  className={thread.threadId === currThreadId ? "active" : ""}
                >
                  <i className="fa-regular fa-message chat-icon"></i>
                  <span className="title">{thread.title}</span>
                  <i
                    className="fa-solid fa-trash delete-icon deleteButton"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteThread(thread.threadId);
                    }}
                  ></i>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom Section */}
        <div className="bottom-section">
          <div className="bottom-item" onClick={() => setModalType("help")}>
            <i className="fa-regular fa-circle-question"></i>
            {extended && <p>Help</p>}
          </div>
          <div className="bottom-item" onClick={() => setModalType("activity")}>
            <i className="fa-solid fa-clock-rotate-left"></i>
            {extended && <p>Activity</p>}
          </div>
          <div className="bottom-item" onClick={() => setModalType("settings")}>
            <i className="fa-solid fa-gear"></i>
            {extended && <p>Settings</p>}
          </div>
        </div>
      </section>

      {/* Modals for Sidebar Items */}
      {modalType && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === "help" && "Help & Support"}
                {modalType === "activity" && "Your Activity"}
                {modalType === "settings" && "Settings"}
              </h3>
              <i
                className="fa-solid fa-xmark close-modal"
                onClick={() => setModalType(null)}
              ></i>
            </div>
            <div className="modal-body">
              {modalType === "help" && (
                <div className="help-content">
                  <p>Welcome to Synora!</p>
                  <ul>
                    <li>Type your questions in the input box.</li>
                    <li>Hit Enter or click the send icon.</li>
                    <li>Access past threads from the sidebar.</li>
                  </ul>
                  <button className="neon-btn" onClick={() => setModalType(null)}>Got it</button>
                </div>
              )}
              {modalType === "activity" && (
                <div className="activity-content">
                  <p>Recent activity logs:</p>
                  <ul className="activity-list">
                    <li><i className="fa-solid fa-check"></i> Logged in today</li>
                    <li><i className="fa-solid fa-message"></i> Started {allThreads?.length || 0} conversation(s)</li>
                    <li><i className="fa-solid fa-bolt"></i> Synora AI is online</li>
                  </ul>
                </div>
              )}
              {modalType === "settings" && (
                <div className="settings-content">
                  <div className="setting-item">
                    <span>Dark Mode</span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={isDarkMode}
                        onChange={() => setIsDarkMode(!isDarkMode)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <span>Notifications</span>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <button className="neon-btn" onClick={() => setModalType(null)}>Save Changes</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Sidebar;
