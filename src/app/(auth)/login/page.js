"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

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
          window.location.href = "/my-list"; // Ricaricare completamente la pagina
        }, 1500);
      } catch (error) {
        setErrors({ submit: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 text-white p-4">
      <div className="max-w-md w-full relative">
        {/* Form con box container */}
        <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl border border-gray-700 relative">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Email */}
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

            {/* Campo Password */}
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

            {/* Bottone Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg disabled:bg-gray-500"
            >
              {loading ? "Caricamento..." : "Accedi"}
            </button>

            {errors.submit && (
              <p className="text-red-400 text-sm text-center mt-2">
                {errors.submit}
              </p>
            )}

            {success && (
              <div className="text-center text-green-400 p-3 rounded mt-2 bg-green-900/30">
                ✓ Login avvenuto! Reindirizzamento...
              </div>
            )}
          </form>

          {/* Personaggio che si appoggia al bordo superiore destro - DESKTOP */}
          <div className="hidden md:block absolute -top-29 right-10 pointer-events-none">
            <Image
              src="/loginAnime.png"
              alt="personaggio anime"
              width={250}
              height={200}
              className="object-contain drop-shadow-2xl  "
            />
          </div>

          {/* Personaggio che si appoggia sopra - MOBILE */}
          <div className="md:hidden absolute -top-22 right-2 pointer-events-none">
            <Image
              src="/loginAnime.png"
              alt="personaggio anime"
              width={200}
              height={200}
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
