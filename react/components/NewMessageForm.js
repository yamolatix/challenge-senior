import React from "react";

export default function NewMessageForm() {
  return (
    <form>
      <div className="form-group">
        <label>To:</label>
        <input type="text" id="recipient-field" name="recipient" />
      </div>
      <div className="form-group">
        <label>Subject:</label>
        <input type="text" id="subject-field" name="subject" />
      </div>
      <div className="form-group">
        <label>Body:</label>
        <textarea id="body-field" name="body" />
      </div>
      <button type="submit">Send Message</button>
    </form>
  );
}
