import { ReactNode } from "react";

export const metadata = {
  title: "La Mia Lista - My AnimeWorld",
  description:
    "Gestisci la tua lista personale di anime preferiti su My AnimeWorld",
};

interface MyListLayoutProps {
  children: ReactNode;
}

export default function MyListLayout({ children }: MyListLayoutProps) {
  return <>{children}</>;
}
