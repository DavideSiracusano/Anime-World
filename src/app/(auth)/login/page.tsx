"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "@/services/api";

interface LoginErrors {
  email?: string;
  password?: string;
  submit?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: LoginErrors = {};

    if (!email) {
      newErrors.email = "Email richiesta";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email non valida";
    }

    if (!password) {
      newErrors.password = "Password richiesta";
    } else if (password.length < 6) {
      newErrors.password = "Minimo 6 caratteri";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await authService.login(email, password);
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/my-list";
        }, 1500);
      } catch (error: any) {
        const errorMsg =
          error.message === "User not found"
            ? "Utente non trovato"
            : error.message === "Invalid password"
              ? "Password scorretta"
              : error.message;
        setErrors({ submit: errorMsg });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 text-white p-4">
      <div className="relative w-full max-w-md">
        {/* Immagine responsive che si appoggia sopra il form - Mobile */}
        <div className="md:hidden absolute left-34 -top-15 z-20 pointer-events-none">
          <Image
            src="/loginAnime.png"
            alt="Login anime character"
            width={200}
            height={150}
            className="drop-shadow-2xl w-40 h-auto"
            priority
          />
        </div>

        {/* Immagine responsive che si appoggia sopra il form - Desktop */}
        <div className="hidden md:block absolute left-40 -top-25 z-20 pointer-events-none">
          <Image
            src="/loginAnime.png"
            alt="Login anime character"
            width={240}
            height={200}
            className="drop-shadow-2xl w-56 h-auto"
            priority
          />
        </div>

        {/* Form di login - dietro */}
        <div className="relative z-0 w-full h-auto bg-gray-800/90 backdrop-blur-sm p-8  rounded-lg shadow-2xl border border-gray-700">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded mb-4 text-center">
              <span>Accesso riuscito! Reindirizzamento...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Inserisci la tua email"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Inserisci la tua password"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded text-center">
                <span>{errors.submit}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg disabled:bg-gray-500 transition-colors"
            >
              {loading ? "Caricamento..." : "Accedi"}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-300">
            Non hai un account?{" "}
            <a href="/signup" className="text-pink-400 hover:underline">
              Registrati
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
