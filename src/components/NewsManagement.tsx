// src/components/NewsAdminForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const NewsAdminForm = ({ onNewsAdded }: { onNewsAdded: () => void }) => {
  const [newsData, setNewsData] = useState({
    title: "",
    type: "announcement",
    content: "",
    date: "",
    eventDate: "",
    location: "",
    mediaUrl: "",
    featured: false,
  });

  const { token } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const value: string | boolean =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setNewsData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/news", newsData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("News article added successfully!");
      setNewsData({
        title: "",
        type: "announcement",
        content: "",
        date: "",
        eventDate: "",
        location: "",
        mediaUrl: "",
        featured: false,
      });
      onNewsAdded();
    } catch (err) {
      alert("Failed to add news article.");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl mb-4 font-semibold">Add News Article</h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={newsData.title}
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border rounded"
      />

      <select
        name="type"
        value={newsData.type}
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="announcement">Announcement</option>
        <option value="event">Event</option>
        <option value="successStory">Success Story</option>
        <option value="pressRelease">Press Release</option>
        <option value="industryNews">Industry News</option>
        <option value="blog">Blog</option>
        <option value="multimedia">Multimedia</option>
      </select>

      <textarea
        name="content"
        placeholder="Content"
        value={newsData.content}
        onChange={handleChange}
        required
        rows={6}
        className="w-full p-2 mb-4 border rounded"
      />

      <input
        type="date"
        name="date"
        value={newsData.date}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />

      {newsData.type === "event" && (
        <>
          <input
            type="date"
            name="eventDate"
            value={newsData.eventDate}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={newsData.location}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
        </>
      )}

      <input
        type="url"
        name="mediaUrl"
        placeholder="Media URL (optional)"
        value={newsData.mediaUrl}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="inline-flex items-center mb-4 space-x-2">
        <input
          type="checkbox"
          name="featured"
          checked={newsData.featured}
          onChange={handleChange}
          className="form-checkbox"
        />
        <span>Featured</span>
      </label>

      <button
        type="submit"
        className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition"
      >
        Add News
      </button>
    </form>
  );
};

export default NewsAdminForm;
