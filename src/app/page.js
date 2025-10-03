import Home from "./Home/page";

export function generateMetadata() {
  return {
    title: "My AnimeWorld",
    description:
      "Benvenuto nella homepage del mio sito Next.js, sito web per gli amanti di anime",
  };
}

export default function Page() {
  return (
    <>
      <Home />
    </>
  );
}
