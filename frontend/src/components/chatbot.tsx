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
      <div style={styles.header}>Safina Carpets Assistant</div>

      <div style={styles.messages}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              background:
                msg.role === "user" ? "#e0f7fa" : "#f1f1f1",
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.content}
          </div>
        ))}
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
        <button style={styles.button} onClick={sendMessage} disabled={loading}>
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
    width: "319px",
    height: "601px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    background: "#4a148c",
    color: "white",
    padding: "10px",
    fontWeight: "bold",
    textAlign: "center",
  },
  messages: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "8px",
    maxWidth: "80%",
    whiteSpace: "pre-wrap",
  },
  inputBox: {
    display: "flex",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none",
  },
  button: {
    background: "#4a148c",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
  },
};
