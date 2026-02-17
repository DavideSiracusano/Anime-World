import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RootClientLayout } from "./RootClientLayout";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Home - My AnimeWorld",
  description:
    "Scopri i migliori anime del momento. Ricerca, salva e gestisci i tuoi anime preferiti in un'unica piattaforma.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootClientLayout className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </RootClientLayout>
      </body>
    </html>
  );
}
