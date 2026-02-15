import { ReactNode } from "react";

export const metadata = {
  title: "Topics - My AnimeWorld",
  description: "Esplora i vari argomenti e discussioni su My AnimeWorld",
  keywords: "anime, argomenti, discussioni",
};

interface TopicsLayoutProps {
  children: ReactNode;
}

export default function TopicsLayout({ children }: TopicsLayoutProps) {
  return <>{children}</>;
}
