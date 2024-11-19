"use client";

import { useState } from "react";
import { saveVideo } from "../../lib/firestore";

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveVideo({ title, videoId, speaker, date });
    setTitle("");
    setVideoId("");
    setSpeaker("");
    setDate("");
    alert("Video saved successfully!");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "0 auto" }}>
      <h1>Upload Video</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="YouTube Video ID"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Speaker"
        value={speaker}
        onChange={(e) => setSpeaker(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default UploadPage;
