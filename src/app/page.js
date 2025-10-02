import Home from "./Home/page";

export function generateMetadata() {
  return {
    title: "Home Page",
    description:
      "Benvenuto nel mio sito Next.js, sito web per gli amanti di anime",
  };
}

export default function Page() {
  return (
    <>
      <Home />
    </>
  );
}
