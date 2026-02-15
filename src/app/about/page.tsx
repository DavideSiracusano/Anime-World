import Link from "next/link";

export default function About() {
  return (
    <section className="min-h-screen py-16 px-6 md:px-20 bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          🎬 About This Site
        </h2>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
          Benvenuto nel sito definitivo per gli appassionati di anime! Qui puoi
          scoprire e cercare i tuoi anime preferiti utilizzando le{" "}
          <a
            href="https://soruly.github.io/trace.moe-api/#/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-purple-400 hover:underline"
          >
            API di Trace.moe
          </a>{" "}
          e le{" "}
          <a
            href="https://jikan.moe/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-purple-400 hover:underline"
          >
            Jikan REST API
          </a>
          .
        </p>
        <p className="text-indigo-400 text-lg md:text-xl leading-relaxed mb-6">
          Aggiungi anime alla tua lista personale, tieni traccia delle serie che
          segui e, grazie all'integrazione con Trace.moe, puoi cercare un anime
          partendo da un'immagine o uno screenshot 📸 – perfetto per veri{" "}
          <span className="text-pink-400 font-semibold">otaku</span>!
        </p>
        <Link
          href="/"
          className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Scopri gli anime ora!
        </Link>
      </div>
    </section>
  );
}
