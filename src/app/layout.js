import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Navbar from "@/components/Navbar/Navbar";
import Main from "@/components/Main/Main";
import Footer from "@/components/Footer/Footer";
import { AuthProvider } from "@/context/AuthContext";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header>
            <Navbar />
          </Header>

          <Main>{children}</Main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
