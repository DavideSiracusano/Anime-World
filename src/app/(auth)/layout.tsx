import { ReactNode } from "react";

export const metadata = {
  title: "Autenticazione - My AnimeWorld",
  description: "Login e registrazione a My AnimeWorld",
};

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <>{children}</>;
}
