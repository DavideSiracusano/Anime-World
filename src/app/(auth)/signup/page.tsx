"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/services/api";

interface SignupErrors {
  name?: string;
  email?: string;
  password?: string;
  submit?: string;
}

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<SignupErrors>({});
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: SignupErrors = {};

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
      } catch (error: any) {
        setErrors({ submit: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 text-white p-4">
      <div className="w-full max-w-5xl flex items-center gap-12 flex-col md:flex-row-reverse">
        {/* Immagine per desktop - più grande e visibile */}
        <div className="hidden md:block flex-shrink-0 w-96">
          <Image
            src="/signupAnime.png"
            alt="Signup anime character"
            width={500}
            height={650}
            className="w-full h-auto rounded-lg shadow-2xl object-cover"
            priority
          />
        </div>

        {/* Form di signup */}
        <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl border border-gray-700">
          <h1 className="text-3xl font-bold mb-6 text-center">Registrati</h1>

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded mb-4 text-center">
              <span>Registrazione riuscita! Reindirizzamento...</span>
            </div>
          )}

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

            {errors.submit && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4 text-center">
                <span>{errors.submit}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg disabled:bg-gray-500 transition-colors"
            >
              {loading ? "Caricamento..." : "Registrati"}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-300">
            Hai già un account?{" "}
            <Link href="/login" className="text-pink-400 hover:underline">
              Accedi
            </Link>
          </p>
        </div>

        {/* Immagine per mobile - piccola sotto il form */}
        <div className="md:hidden w-full flex justify-center ">
          <Image
            src="/signupAnime.png"
            alt="Signup anime character"
            width={250}
            height={320}
            className="w-[250px] rounded-4xl h-auto  shadow-lg object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
