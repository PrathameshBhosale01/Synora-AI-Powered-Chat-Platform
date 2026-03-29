import "./Chat.css";
import { useContext, useEffect, useState, useRef } from "react";
import { MyContext } from "../../context/MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState("");
  const intervalRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!reply) {
      setLatestReply("");
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);

    let index = 0;

    intervalRef.current = setInterval(() => {
      // Speed: 20 chars every 30ms (Fast & Smooth)
      index += 20;

      if (index >= reply.length) {
        setLatestReply(reply);
        clearInterval(intervalRef.current);
      } else {
        setLatestReply(reply.slice(0, index));
      }
    }, 30);

    return () => clearInterval(intervalRef.current);
  }, [reply]);

  // Instant Scroll: Forces the view to stay at the bottom while typing
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [latestReply]);

  return (
    <div className="chats">
      {newChat && <h1 className="welcome-text">Start a new Chat!</h1>}

      {prevChats?.map((chat, idx) => {
        const isLastMessage = idx === prevChats.length - 1;
        const isBot = chat.role === "assistant";
        const isTyping = isLastMessage && isBot && reply;

        // Mock sequential timestamps for UI visual purposes
        const messageTime = new Date();
        messageTime.setMinutes(messageTime.getMinutes() - (prevChats.length - 1 - idx));
        const timeString = messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <div
            className={chat.role === "user" ? "userDiv" : "geminiDiv"}
            key={idx}
          >
            {chat.role === "assistant" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "5px",
                }}
              >
                <i
                  className="fa-solid fa-sparkles"
                  style={{ color: "var(--accent-color)" }}
                ></i>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#ececec",
                  }}
                >
                  Synora {isTyping && <span className="typing-dots">...</span>}
                </span>
              </div>
            )}
            
            {chat.role === "user" ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <p className="userMessage">{chat.content}</p>
                <span className="msg-timestamp">{timeString} {isLastMessage ? <i className="fa-solid fa-check-double" style={{marginLeft: '4px', color: 'var(--accent-color)'}}></i> : <i className="fa-solid fa-check-double" style={{marginLeft: '4px'}}></i>}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                <ReactMarkdown rehypePlugins={rehypeHighlight}>
                  {isTyping ? latestReply : chat.content}
                </ReactMarkdown>
                <span className="msg-timestamp">{timeString}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Invisible anchor to scroll to */}
      <div ref={chatEndRef}></div>
    </div>
  );
}

export default Chat;
