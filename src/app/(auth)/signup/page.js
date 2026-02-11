"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authService } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name) {
      newErrors.name = "Nome richiesto";
    }

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
        await authService.signup(name, email, password);
        setSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          window.location.href = "/my-list";
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
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-0 items-stretch relative">
        {/* Form - Sinistra */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 bg-gray-900/50 rounded-l-lg backdrop-blur-sm z-10">
          <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
            Registrati
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Inserisci il tuo nome"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition disabled:bg-gray-500"
            >
              {loading ? "Caricamento..." : "Registrati"}
            </button>

            {errors.submit && (
              <p className="text-red-400 text-sm text-center mt-2">
                {errors.submit}
              </p>
            )}

            <p className="text-center mt-4">
              Hai già un account?{" "}
              <Link href="/login" className="text-pink-500 hover:text-pink-400">
                Accedi
              </Link>
            </p>

            {success && (
              <div className="text-center text-green-400 p-3 rounded mt-2 bg-green-900/30">
                ✓ Registrazione avvenuta con successo!
              </div>
            )}
          </form>
        </div>

        {/* Immagine - Destra (piccola su mobile, grande su desktop) */}
        <div className="w-full md:w-1/2 md:-ml-16 flex items-center justify-center md:justify-end z-20">
          <Image
            src="/signupAnime.png"
            alt="personaggio anime che fa registrazione"
            width={400}
            height={400}
            className="w-3/5 rounded-[25%]  md:w-4/5 md:rounded-none shadow-2xl object-cover"
          />
        </div>
      </div>
    </div>
  );
}
