import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Connect to your server
const socket = io("http://localhost:8001");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Connecting...");
  const [messages, setMessages] = useState([]);

  const token = localStorage.getItem("token");


  useEffect(() => {
    // On successful connection
    socket.on("connect", () => {
      setStatus(`🟢 Connected as ${socket.id}`);
    });

    // On disconnection
    socket.on("disconnect", () => {
      setStatus("🔴 Disconnected");
    });

    // Listen for server messages
    socket.on("messageFromServer", (msg) => {
      setMessages((prev) => [...prev, msg]); // msg = { id, text }
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("messageFromServer");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const msgObject = {
        id: socket.id,
        text: message,
        token: token,
        str: "5"
      };
      socket.emit("sendMessage", msgObject);
      setMessage("");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-3">Live Chat (comments)</h1>
      <p className="text1">{status}</p>
      <div
        className="border rounded p-3 text1"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        {messages.length === 0 ? (
          <p className="text1">No messages yet.</p>
        ) : (
          messages.map((msg, idx) => (
            <p
              key={idx}
              className={`mb-1 ${msg.id === socket.id ? "text-primary" : "text1"
                }`}
            >
              <strong>{msg.id === socket.id ? "YOU" : "They"}:</strong>{" "}
              {msg.text}
            </p>
          ))
        )}
      </div> <br/>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>

      <h5 className="mb-2">
        Your ID: <span className="text-success">{}</span>
      </h5>
    </div>
  );
};

export default Chat;