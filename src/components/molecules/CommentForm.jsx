"use client";

import { useState } from "react";
import { commentService } from "@/services/api";

export default function CommentForm({ topicId, onCommentAdded }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await commentService.createComment(
        topicId,
        content.trim(),
      );

      setContent("");
      onCommentAdded(response.data);
    } catch (err) {
      setError(err.message || "Errore nell'invio del commento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Scrivi un commento..."
          rows="3"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none text-sm"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold py-2 rounded-lg transition duration-200 text-sm"
        >
          {loading ? "Invio..." : "Commenta"}
        </button>
      </div>
    </form>
  );
}
