"use client";
import { useState, useEffect } from "react";
import { topicService, commentService } from "@/services/api";
import CommentForm from "@/components/molecules/CommentForm";

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [topicComments, setTopicComments] = useState({});

  useEffect(() => {
    const fetchTopicsAndComments = async () => {
      try {
        const topicsResponse = await topicService.getTopics();
        const topicsList = topicsResponse.data;
        setTopics(topicsList);

        // Carica i commenti per ogni topic
        const allComments = {};
        for (const topic of topicsList) {
          try {
            const commentsResponse = await commentService.getComments(topic.id);
            allComments[topic.id] = commentsResponse.data || [];
          } catch (error) {
            console.error(
              `Errore caricamento commenti per topic ${topic.id}:`,
              error,
            );
            allComments[topic.id] = [];
          }
        }
        setTopicComments(allComments);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopicsAndComments();
  }, []);

  const handleExpandTopic = async (topicId) => {
    if (expandedTopic === topicId) {
      setExpandedTopic(null);
      return;
    }

    setExpandedTopic(topicId);

    if (!topicComments[topicId]) {
      try {
        const response = await commentService.getComments(topicId);
        setTopicComments({
          ...topicComments,
          [topicId]: response.data || [],
        });
      } catch (error) {
        console.error("Errore nel caricamento dei commenti:", error);
      }
    }
  };

  const handleAddTopic = async () => {
    if (!newTopic.title.trim() || !newTopic.content.trim()) return;
    try {
      const response = await topicService.createTopic(newTopic);
      setTopics([...topics, response.data]);
      setNewTopic({ title: "", content: "" });
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="topics-page min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">Community Topics</h1>
        <p className="text-gray-400 text-lg">
          Condividi le tue opinioni su anime, manga, recensioni e molto altro.
          Unisciti alla community di My AnimeWorld!
        </p>
      </div>

      {/* Form di creazione */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-5">
            Crea un nuovo post
          </h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="newTopic"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Titolo
              </label>
              <input
                type="text"
                id="newTopic"
                value={newTopic.title}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, title: e.target.value })
                }
                placeholder="Es: Quale è il miglior anime di questo anno?"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label
                htmlFor="newTopicContent"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Contenuto
              </label>
              <textarea
                id="newTopicContent"
                value={newTopic.content}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, content: e.target.value })
                }
                placeholder="Scrivi il tuo post qui..."
                rows="5"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
              />
            </div>

            <button
              onClick={handleAddTopic}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Pubblica Post
            </button>
          </div>
        </div>
      </div>

      {/* Lista dei topics */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center">
            <p className="text-gray-400 text-lg">Caricamento...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-lg">
            <p>Errore: {error.message}</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400 text-lg">
              Nessun post ancora. Sii il primo!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-xl p-6 shadow-lg hover:shadow-2xl transition duration-300 hover:border-blue-500"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {topic.user?.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-sm">
                      {topic.user?.name || "Anonimo"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(topic.createdAt).toLocaleDateString("it-IT", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Titolo */}
                <h2 className="text-2xl font-bold text-white mb-3">
                  {topic.title}
                </h2>

                {/* Divisore */}
                <div className="w-full h-px bg-gray-600 mb-4"></div>

                {/* Contenuto */}
                <p className="text-gray-300 leading-relaxed mb-5 text-sm">
                  {topic.content}
                </p>

                {/* Azioni */}
                <div className="flex gap-6 pt-4 border-t border-gray-600">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm font-semibold transition group">
                    <span className="text-lg group-hover:scale-125 transition">
                      ♥
                    </span>
                    <span>Mi piace</span>
                  </button>
                  <button
                    onClick={() => handleExpandTopic(topic.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-400 text-sm font-semibold transition group"
                  >
                    <span className="text-lg group-hover:scale-125 transition">
                      💬
                    </span>
                    <span>
                      Commenti ({topicComments[topic.id]?.length || 0})
                    </span>
                  </button>
                </div>

                {/* Commenti */}
                {expandedTopic === topic.id && (
                  <div className="mt-4">
                    {topicComments[topic.id]?.length > 0 && (
                      <div className="mb-4 space-y-3 bg-gray-900 p-3 rounded-lg">
                        <p className="text-gray-300 font-semibold text-sm">
                          Commenti ({topicComments[topic.id].length})
                        </p>
                        {topicComments[topic.id].map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-gray-800 p-3 rounded text-sm"
                          >
                            <p className="font-semibold text-blue-400">
                              {comment.user?.name || "Anonimo"}
                            </p>
                            <p className="text-gray-300 mt-1">
                              {comment.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(comment.createdAt).toLocaleDateString(
                                "it-IT",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <CommentForm
                      topicId={topic.id}
                      onCommentAdded={(comment) => {
                        setTopicComments({
                          ...topicComments,
                          [topic.id]: [
                            comment,
                            ...(topicComments[topic.id] || []),
                          ],
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
