"use client";

import { useState } from "react";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function AnimeRecognizer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Componente per nascondere l'input material ui
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  // Carica immagine e crea anteprima
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Seleziona un file immagine valido");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("Immagine troppo grande. Max 10MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResults([]);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  // Funzione per ottenere i titoli leggibili da Anilist
  const fetchAnilistTitle = async (id) => {
    try {
      const query = `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            title { romaji english native }
          }
        }
      `;
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { id } }),
      });
      const json = await res.json();
      return (
        json.data?.Media?.title || { romaji: null, english: null, native: null }
      );
    } catch {
      return { romaji: null, english: null, native: null };
    }
  };

  // Invia l'immagine a trace.moe e popola i titoli leggibili
  // Invia l'immagine a trace.moe e popola i titoli leggibili
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // Leggi il file come base64
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const traceRes = await fetch("/api/trace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Data }),
      });

      if (!traceRes.ok) throw new Error("Errore nella chiamata a trace.moe");
      const traceData = await traceRes.json();

      if (!traceData.result || traceData.result.length === 0) {
        setResults([]);
        setError("Nessun anime trovato");
        return;
      }

      // Ottieni titoli leggibili da Anilist
      const fullResults = await Promise.all(
        traceData.result.slice(0, 5).map(async (item) => {
          const title = await fetchAnilistTitle(item.anilist);
          return { ...item, anilistTitle: title };
        })
      );

      setResults(fullResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">🔍 Riconoscitore Anime</h1>
      <p className="text-gray-600 mb-6 text-center">
        Carica uno screenshot o un`immagine di un anime per scoprire da quale
        serie proviene 🎐
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full max-w-md"
      >
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Carica qui la tua immagine, otaku!
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            multiple
          />
        </Button>

        {preview && (
          <img
            src={preview}
            alt="Anteprima"
            className="w-full rounded-lg border-2 shadow-md mt-2"
          />
        )}

        <button
          type="submit"
          disabled={!file || loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold disabled:bg-gray-400 hover:bg-blue-700 transition"
        >
          {loading ? "🔄 Analizzando..." : "🚀 Cerca Anime"}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mt-6">
          <p className="font-bold">❌ Errore:</p>
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center mt-8">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-600 font-semibold">
            Analizzando immagine...
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8 w-full space-y-6">
          {results.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl p-5 bg-gray-400 shadow-lg hover:shadow-xl transition"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt="Scene"
                    className="md:w-48 w-full rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800">
                    {item.anilistTitle.romaji ||
                      item.anilistTitle.english ||
                      item.anilistTitle.native ||
                      `Titolo sconosciuto (ID: ${item.anilist})`}
                  </h3>
                  <p className="mb-2 text-gray-800">
                    Somiglianza: {(item.similarity * 100).toFixed(1)}%
                  </p>
                  {item.episode && (
                    <p className="mb-2 text-gray-800">
                      📺 Episodio: {item.episode}
                    </p>
                  )}
                  {item.from !== undefined && (
                    <p className="text-gray-800">
                      ⏱️ Timestamp: {formatTime(item.from)} -{" "}
                      {formatTime(item.to)}
                    </p>
                  )}
                </div>
              </div>
              {item.video && (
                <video
                  src={item.video}
                  controls
                  className="w-full rounded-lg mt-2"
                  preload="metadata"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
