import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../constants";
import io from "socket.io-client";
import "./groupchat.css";

let socket;

function Groupchat() {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const { productId } = useParams();
  const userName = localStorage.getItem("userName"); // Fetch the logged-in user's name

  useEffect(() => {
    socket = io(API_URL);

    socket.on("connect", () => {
      console.log("Connected to socket");
    });

    return () => {
      socket.disconnect();
      console.log("Disconnected from socket");
    };
  }, []);

  useEffect(() => {
    socket.on("getMsg", (data) => {
      const filteredData = data.filter((item) => item.productId === productId);
      setMsgs(filteredData);
    });
  }, [productId]);

  const handleSend = () => {
    if (!socket) {
      console.error("Socket is not initialized.");
      return;
    }

    const data = {
      username: userName,
      msg,
      productId,
    };

    console.log("Sending message:", data);
    socket.emit("sendMsg", data);
    setMsg("");
  };

  return (
    <div className="groupchat-container">
      <div className="groupchat">
        <h4>Group Chat</h4>
        {msgs.map((item, index) => (
          <div
            key={index}
            style={{
              textAlign: item.username === userName ? "right" : "left",
              margin: "5px",
              padding: "5px",
              borderRadius: "5px",
              backgroundColor: item.username === userName ? "#DCF8C6" : "#FFF",
              display: "flex",
              flexDirection: "column",
              alignItems:
                item.username === userName ? "flex-end" : "flex-start",
            }}
          >
            {item.username !== userName && (
              <span
                style={{
                  fontWeight: "bold",
                  color: "blue",
                  marginRight: "5px",
                }}
              >
                {item.username}:
              </span>
            )}
            <span
              style={{ color: item.username === userName ? "green" : "black" }}
            >
              {item.msg}
            </span>
          </div>
        ))}
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="chat-input mt-3 form-control"
          type="text"
          placeholder="Type your message..."
        />
        <br />
        <button onClick={handleSend} className="mt-3 group-btn">
          SEND
        </button>
      </div>
    </div>
  );
}

export default Groupchat;
