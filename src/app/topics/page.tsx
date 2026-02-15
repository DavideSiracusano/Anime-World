"use client";

import { useState, useEffect } from "react";
import {
  authService,
  topicService,
  commentService,
  likeService,
} from "@/services/api";
import CommentForm from "@/components/molecules/CommentForm";

interface Topic {
  id: string | number;
  title: string;
  content: string;
  user?: { name: string };
  userId?: string;
  createdAt: string;
}

interface Comment {
  id: string | number;
  content: string;
  user?: { name: string };
  createdAt?: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

interface NewTopicData {
  title: string;
  content: string;
}

interface LikeResponse {
  likeCount: number;
}

interface CheckLikeResponse {
  liked: boolean;
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState<NewTopicData>({
    title: "",
    content: "",
  });
  const [error, setError] = useState<string | null | Error>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedTopic, setExpandedTopic] = useState<string | number | null>(
    null,
  );
  const [topicComments, setTopicComments] = useState<
    Record<string | number, Comment[]>
  >({});
  const [topicLikes, setTopicLikes] = useState<Record<string | number, number>>(
    {},
  );
  const [userLikes, setUserLikes] = useState<Record<string | number, boolean>>(
    {},
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const fetchTopicsAndComments = async () => {
      try {
        const topicsResponse = await topicService.getTopics();
        const topicsList = topicsResponse.data as Topic[];

        // Ordina i topic in ordine discendente (più recenti prima)
        const sortedTopics = topicsList.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setTopics(sortedTopics);

        // Carica i commenti per ogni topic
        const allComments: Record<string | number, Comment[]> = {};
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
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchTopicsAndComments();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchLikes = async () => {
      const allLikes: Record<string | number, number> = {};
      const userLikesData: Record<string | number, boolean> = {};
      for (const topic of topics) {
        try {
          const likesResponse = (await likeService.getLikes(
            topic.id,
          )) as LikeResponse;
          allLikes[topic.id] = likesResponse.likeCount || 0;

          // Carica se l'utente ha messo like
          try {
            const checkResponse = (await likeService.checkUserLike(
              topic.id,
            )) as CheckLikeResponse;
            userLikesData[topic.id] = checkResponse.liked || false;
          } catch (error) {
            userLikesData[topic.id] = false;
          }
        } catch (error) {
          console.error(
            `Errore caricamento likes per topic ${topic.id}:`,
            error,
          );
          allLikes[topic.id] = 0;
          userLikesData[topic.id] = false;
        }
      }
      setTopicLikes(allLikes);
      setUserLikes(userLikesData);
    };
    fetchLikes();
  }, [topics]);

  const handleExpandTopic = async (topicId: string | number) => {
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
      setTopics([response.data, ...topics]); // Nuovo topic in cima
      setNewTopic({ title: "", content: "" });
      setToast({
        message: "Post pubblicato con successo!",
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setError(error);
      setToast({
        message: "Errore nella pubblicazione del post",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  // Controlla se l'utente ha effettuato il login
  const handleAuthCheck = async () => {
    try {
      await authService.getMe();
      setIsAuthenticated(true);
    } catch (error) {
      // Utente non autenticato - comportamento atteso
      setIsAuthenticated(false);
    }
  };

  // Effettua il controllo all'avvio
  useEffect(() => {
    handleAuthCheck();
  }, []);

  const handleLikeTopic = async (topicId: string | number) => {
    try {
      // Chiama addLike - il backend fa il toggle automatico
      await likeService.addLike(topicId);

      // Ricarica il contatore e lo stato per sincronizzare
      const likesResponse = (await likeService.getLikes(
        topicId,
      )) as LikeResponse;
      const checkResponse = (await likeService.checkUserLike(
        topicId,
      )) as CheckLikeResponse;

      setTopicLikes({
        ...topicLikes,
        [topicId]: likesResponse.likeCount || 0,
      });

      setUserLikes({
        ...userLikes,
        [topicId]: checkResponse.liked || false,
      });
    } catch (error) {
      console.error("Errore nel gestire il like:", error);
    }
  };

  return (
    <div className="topics-page min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      {/* Toast Notification */}
      {toast && (
        <div className="toast toast-top toast-center" data-theme="light">
          {toast.type === "success" && (
            <div className="alert alert-success">
              <span>{toast.message}</span>
            </div>
          )}
          {toast.type === "error" && (
            <div className="alert alert-error">
              <span>{toast.message}</span>
            </div>
          )}
        </div>
      )}
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">Community Topics</h1>
        <p className="text-gray-400 text-lg">
          Condividi le tue opinioni su anime, manga, recensioni e molto altro.
          Unisciti alla community di My AnimeWorld!
        </p>
      </div>
      {/*se l'utente non ha effettuato il login*/}
      {!isAuthenticated && (
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center bg-yellow-900 border border-yellow-700 text-yellow-200 px-6 py-4 rounded-lg">
            <p>Effettua il login per partecipare alla discussione 😡</p>
          </div>
        </div>
      )}
      {/*se l'utente ha effettuato il login*/}
      {isAuthenticated && (
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
                  rows={5}
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
      )}
      {/* Lista dei topics */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center">
            <p className="text-gray-400 text-lg">Caricamento...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded-lg ">
            <p>
              Errore:{" "}
              {error instanceof Error ? error.message : "Errore sconosciuto"}
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
                  <button
                    className={`flex items-center gap-2 text-sm font-semibold transition group ${
                      userLikes[topic.id]
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-400 hover:text-red-400"
                    }`}
                    onClick={() => handleLikeTopic(topic.id)}
                  >
                    <span className="text-lg group-hover:scale-125 transition">
                      ♥
                    </span>
                    <span>Mi piace ({topicLikes[topic.id] || 0})</span>
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
                              {comment.createdAt &&
                                new Date(comment.createdAt).toLocaleDateString(
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
