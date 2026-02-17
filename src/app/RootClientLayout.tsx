"use client";

import { ReactNode } from "react";
import Header from "@/components/Header/Header";
import Navbar from "@/components/Navbar/Navbar";
import Main from "@/components/Main/Main";
import Footer from "@/components/Footer/Footer";
import { AuthProvider } from "@/context/AuthContext";

interface RootClientLayoutProps {
  children: ReactNode;
  className: string;
}

export function RootClientLayout({
  children,
  className,
}: RootClientLayoutProps) {
  return (
    <AuthProvider>
      <Header>
        <Navbar />
      </Header>
      <Main>{children}</Main>
      <Footer />
    </AuthProvider>
  );
}
