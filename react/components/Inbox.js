import React from "react";
import Message from "./Message";

export default function Inbox() {

  const [messages, setMessages] = React.useState([]);

  return (
    <div>
      <h1>Inbox</h1>
      {messages.map((message) =>
        <Message key={message.id} fullMessage={message} />
      )}
    </div>
  );
};
