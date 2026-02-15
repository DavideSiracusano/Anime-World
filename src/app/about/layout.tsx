import { ReactNode } from "react";

export const metadata = {
  title: "Chi Siamo - My AnimeWorld",
  description:
    "My AnimeWorld è la piattaforma definitiva per gli appassionati di anime. Ricerca, scopri e salva i tuoi anime preferiti con le API di Trace.moe e Jikan.",
};

interface AboutLayoutProps {
  children: ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return <>{children}</>;
}
