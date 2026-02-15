import FetchNews from "@/components/organisms/FetchNews";

export const metadata = {
  title: "My AnimeWorld",
  description:
    "Benvenuto nella homepage del mio sito Next.js, sito web per gli amanti di anime",
};

export default function Home() {
  return (
    <div>
      <h1 className="home-title text-center text-2xl font-bold my-4">
        Top Anime Del Momento!
      </h1>
      <FetchNews />
    </div>
  );
}
