const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiCallOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function apiCall<T = any>(
  endpoint: string,
  options: ApiCallOptions = {},
): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // Se non è JSON, mantieni il messaggio generico
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

interface LoginResponse {
  success: boolean;
  message: string;
  user: { id: string; name: string; email: string };
  token: string;
}

interface SignupResponse {
  success: boolean;
  message: string;
  user: { id: string; name: string; email: string };
  token: string;
}

interface GetMeResponse {
  authenticated: boolean;
  user: { id: string; name: string; email: string };
}

export const authService = {
  login: (email: string, password: string): Promise<LoginResponse> =>
    apiCall<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (
    name: string,
    email: string,
    password: string,
  ): Promise<SignupResponse> =>
    apiCall<SignupResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  logout: (): Promise<{ success: boolean; message: string }> =>
    apiCall("/api/auth/logout", {
      method: "POST",
    }),

  getMe: (): Promise<GetMeResponse> =>
    apiCall<GetMeResponse>("/api/auth/me", {
      method: "GET",
    }),
};

interface Favorite {
  id: string;
  mal_id: number;
  title: string;
  image: string;
  createdAt: string;
}

export const favoriteService = {
  getFavorites: (): Promise<{ success: boolean; data: Favorite[] }> =>
    apiCall("/api/favorites", {
      method: "GET",
    }),

  addFavorite: (mal_id: number, title: string, image: string) =>
    apiCall("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ mal_id, title, image }),
    }),

  removeFavorite: (mal_id: number | string) =>
    apiCall(`/api/favorites/${mal_id}`, {
      method: "DELETE",
    }),

  checkIfFavorite: (mal_id: number | string) =>
    apiCall(`/api/favorites/${mal_id}`, {
      method: "GET",
    }),
};

interface Topic {
  id: string;
  title: string;
  content: string;
  userId: string;
  user: { id: string; name: string; email: string };
  createdAt: string;
}

interface CreateTopicRequest {
  title: string;
  content: string;
}

export const topicService = {
  getTopics: (): Promise<{ success: boolean; data: Topic[] }> =>
    apiCall("/api/topics", { method: "GET" }),

  createTopic: (data: CreateTopicRequest) =>
    apiCall("/api/topics", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

interface Comment {
  id: string;
  content: string;
  topicId: number;
  userId: string;
  user: { id: string; name: string; email: string };
  createdAt: string;
}

export const commentService = {
  getComments: (
    topicId: string | number,
  ): Promise<{ success: boolean; data: Comment[] }> =>
    apiCall(`/api/topics/${topicId}/comments`, {
      method: "GET",
    }),

  createComment: (topicId: string | number, content: string) =>
    apiCall(`/api/topics/${topicId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};

interface Like {
  id: string;
  userId: string;
  topicId: number;
}

export const likeService = {
  getLikes: (topicId: string | number): Promise<{ likeCount: number }> =>
    apiCall(`/api/topics/${topicId}/likes`, { method: "GET" }),

  checkUserLike: (topicId: string | number): Promise<{ liked: boolean }> =>
    apiCall(`/api/topics/${topicId}/likes/check`, { method: "GET" }),

  addLike: (topicId: string | number) =>
    apiCall(`/api/topics/${topicId}/likes`, { method: "POST" }),

  removeLike: (topicId: string | number) =>
    apiCall(`/api/topics/${topicId}/likes`, { method: "DELETE" }),
};
