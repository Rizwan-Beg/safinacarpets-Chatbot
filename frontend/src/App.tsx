// frontend/src/App.tsx
import React from "react";
import FloatingChatbot from "./components/FloatingChatbot";

function App() {
  return (
    <div style={{ padding: "180px", minHeight: "100vh" }}>
      <h1>Welcome to Safina Carpets</h1>
      <p>Your premium carpet destination. Click the chat icon in the bottom-right corner to get assistance!</p>
      
      {/* Floating Chatbot Widget */}
      <FloatingChatbot />
    </div>
  );
}

export default App;
