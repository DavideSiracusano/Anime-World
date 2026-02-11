const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function apiCall(endpoint, options = {}) {
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
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

export const authService = {
  login: (email, password) =>
    apiCall("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (name, email, password) =>
    apiCall("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  logout: () =>
    apiCall("/api/auth/logout", {
      method: "POST",
    }),

  getMe: () =>
    apiCall("/api/auth/me", {
      method: "GET",
    }),
};

export const favoriteService = {
  // Ottenere tutti i favoriti dell'utente
  getFavorites: () =>
    apiCall("/api/favorites", {
      method: "GET",
    }),

  // Aggiungere un anime ai preferiti
  addFavorite: (mal_id, title, image) =>
    apiCall("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ mal_id, title, image }),
    }),

  // Rimuovere un anime dai preferiti
  removeFavorite: (mal_id) =>
    apiCall(`/api/favorites/${mal_id}`, {
      method: "DELETE",
    }),

  // Controllare se un anime è nei favoriti
  checkIfFavorite: (mal_id) =>
    apiCall(`/api/favorites/${mal_id}`, {
      method: "GET",
    }),
};
