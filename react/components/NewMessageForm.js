import React from "react";

export default function NewMessageForm({ onSend }) {

  const [recipient, setRecipient] = React.useState("")
  const [subject, setSubject] = React.useState("")
  const [body, setBody] = React.useState("")

  const handleRecipient = (name) => {
    setRecipient(name.target.value);
  };

  const handleSubject = (subject) => {
    setSubject(subject.target.value);
  };

  const handleBody = (body) => {
    setBody(body.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend({ recipient, subject, body })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>To:</label>
        <input type="text" id="recipient-field" name="recipient" value={recipient} onChange={handleRecipient} />
      </div>
      <div className="form-group">
        <label>Subject:</label>
        <input type="text" id="subject-field" name="subject" value={subject} onChange={handleSubject} />
      </div>
      <div className="form-group">
        <label>Body:</label>
        <textarea id="body-field" name="body" value={body} onChange={handleBody} />
      </div>
      <button type="submit">Send Message</button>
    </form>
  );
}