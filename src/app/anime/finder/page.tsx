"use client";

import { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface TraceResult {
  anilist: { id: number };
  similarity: number;
  filename: string;
  episode: number;
  from: number;
  to: number;
}

interface AnilistTitle {
  romaji: string | null;
  english: string | null;
  native: string | null;
}

interface ResultData extends TraceResult {
  titles?: AnilistTitle;
}

export default function AnimeRecognizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<ResultData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
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
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const fetchAnilistTitle = async (id: number): Promise<AnilistTitle> => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () =>
          resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const traceRes = await fetch("/api/trace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Data }),
      });

      if (!traceRes.ok) throw new Error("Errore API trace.moe");

      const traceData = await traceRes.json();
      const resultsWithTitles: ResultData[] = await Promise.all(
        (traceData.result || []).map(async (result: TraceResult) => ({
          ...result,
          titles: await fetchAnilistTitle(result.anilist.id),
        })),
      );

      setResults(resultsWithTitles);
    } catch (err: any) {
      setError(err.message || "Errore nel riconoscimento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🔍 Riconosci Anime da Immagine
      </h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mb-6">
        <div className="mb-4">
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            color="primary"
          >
            Carica Immagine
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          {file && <p className="mt-2 text-sm text-gray-300">{file.name}</p>}
        </div>

        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="max-w-xs h-auto rounded-lg"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={!file || loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Riconoscimento..." : "Riconosci Anime"}
        </button>
      </form>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">
                {result.titles?.english ||
                  result.titles?.romaji ||
                  result.filename}
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                Episodio: {result.episode}
              </p>
              <p className="text-sm text-gray-400">
                Somiglianza: {(result.similarity * 100).toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
