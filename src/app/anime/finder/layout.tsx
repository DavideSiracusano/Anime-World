import { ReactNode } from "react";

export const metadata = {
  title: "Ricerca Anime - My AnimeWorld",
  description:
    "Ricerca e identifica anime tramite screenshot o immagini con il nostro strumento di riconoscimento basato su Trace.moe",
};

interface FinderLayoutProps {
  children: ReactNode;
}

export default function FinderLayout({ children }: FinderLayoutProps) {
  return <>{children}</>;
}
