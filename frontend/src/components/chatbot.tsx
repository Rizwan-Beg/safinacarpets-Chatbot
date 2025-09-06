import React, { useState, useEffect, useRef } from "react";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

interface Source {
  file: string;
  page: string;
}

interface ChatResponse {
  answer: string;
  sources: Source[];
}

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: ChatTurn = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "user-123", // Replace with real user ID in production
          message: input,
          history: messages,
        }),
      });

      if (!res.ok) throw new Error("API request failed");

      const data: ChatResponse = await res.json();

      // Add assistant's reply
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error: Unable to connect to Safina Carpets Assistant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  }

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerText}>
            <div style={styles.title}>Safina Carpets Assistant</div>
            <div style={styles.subtitle}>How can I help you today?</div>
          </div>
          <div style={styles.statusIndicator}></div>
        </div>
      </div>

      <div style={styles.messages}>
        {messages.length === 0 ? (
          <div style={styles.welcomeMessage}>
            <div style={styles.welcomeIcon}>👋</div>
            <div style={styles.welcomeText}>
              Hello! I'm here to help you with any questions about our carpets, pricing, or services.
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                background:
                  msg.role === "user" ? "#DEE2E6" : "#860A0C",
                color: msg.role === "user" ? "#333" : "white",
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.content}
            </div>
          ))
        )}
        {loading && (
          <div style={styles.loadingMessage}>
            <div style={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputBox}>
        <input
          style={styles.input}
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button 
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }} 
          onClick={sendMessage} 
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    width: "350px",
    height: "600px",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    overflow: "hidden",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
  },
  header: {
    background: "linear-gradient(135deg, #860A0C 0%, #6a1b9a 100%)",
    color: "white",
    padding: "16px",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: "16px",
    marginBottom: "2px",
  },
  subtitle: {
    fontSize: "12px",
    opacity: 0.9,
  },
  statusIndicator: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#4caf50",
    animation: "pulse 2s infinite",
  },
  messages: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "#F3F5F6",
  },
  welcomeMessage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
    color: "#666",
  },
  welcomeIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },
  welcomeText: {
    fontSize: "14px",
    lineHeight: "1.4",
  },
  message: {
    padding: "12px 16px",
    borderRadius: "18px",
    maxWidth: "80%",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
    lineHeight: "1.4",
    wordWrap: "break-word",
  },
  loadingMessage: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
  },
  typingIndicator: {
    display: "flex",
    gap: "4px",
  },
  inputBox: {
    display: "flex",
    borderTop: "1px solid #e0e0e0",
    padding: "12px",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    border: "1px solid #e0e0e0",
    borderRadius: "20px",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#E8EBF0",
  },
  button: {
    background: "linear-gradient(135deg, #860A0C 0%, #6a1b9a 100%)",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "20px",
    marginLeft: "8px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
  
  .typing-indicator span {
    height: 8px;
    width: 8px;
    background-color: #4a148c;
    border-radius: 50%;
    display: inline-block;
    animation: typing 1.4s infinite ease-in-out;
  }
  
  .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
  .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes typing {
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);
