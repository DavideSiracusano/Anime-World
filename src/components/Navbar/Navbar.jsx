"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { authService } from "@/services/api";

function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Controlla se l'utente è loggato al caricamento
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.authenticated);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  // ✅ Filter(Boolean) rimuove i valori null dall'array
  const links = [
    { name: "Home", href: "/" },
    { name: "MyAnimeList", href: "/my-list" },
    { name: "AnimeFinder", href: "/anime/finder" },
    !isLoggedIn ? { name: "Login", href: "/login" } : null,
    !isLoggedIn ? { name: "Signup", href: "/signup" } : null,
    isLoggedIn ? { name: "Logout", href: "#", onClick: handleLogout } : null,
    { name: "About", href: "/about" },
  ].filter(Boolean);

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  return (
    <>
      <AppBar position="static">
        <div className="p-4 sm:p-6 bg-[url('/header.png')] bg-cover bg-[center_25%] bg-blend-darken bg-black/50 w-full shadow-2xl">
          <Toolbar className="flex justify-between items-center ">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              My AnimeWorld
            </h1>

            {/* Link desktop - ✅ gestisce sia Link che button con onClick */}
            <div className="hidden md:flex gap-6" suppressHydrationWarning>
              {links.map((link) =>
                link.onClick ? (
                  // Se il link ha onClick (es. Logout), usa un button
                  <button
                    key={link.name}
                    onClick={link.onClick}
                    className="text-white hover:text-red-400 transition cursor-pointer"
                  >
                    {link.name}
                  </button>
                ) : (
                  // Altrimenti usa un Link normale
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-white hover:text-red-400 transition"
                  >
                    {link.name}
                  </Link>
                ),
              )}
            </div>

            {/* Hamburger mobile */}
            <div className="md:hidden">
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                className="text-white"
              >
                <MenuIcon fontSize="large" />
              </IconButton>
            </div>
          </Toolbar>
        </div>
      </AppBar>

      {/* Drawer mobile */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <div className="flex justify-end p-2 bg-gray-900">
          <Button
            variant="outlined"
            color="error"
            onClick={toggleDrawer(false)}
          >
            X
          </Button>
        </div>
        <List className="w-64 bg-gray-800 h-full" suppressHydrationWarning>
          {/* ✅ Anche qui gestisce onClick e Link */}
          {links.map((link) => (
            <ListItem key={link.name} disablePadding>
              {link.onClick ? (
                // Logout: esegue onClick e chiude il drawer
                <ListItemButton
                  onClick={() => {
                    link.onClick();
                    toggleDrawer(false)();
                  }}
                >
                  <ListItemText
                    primary={link.name}
                    className="text-white hover:text-red-400 transition"
                  />
                </ListItemButton>
              ) : (
                // Link normale
                <ListItemButton
                  component={Link}
                  href={link.href}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText
                    primary={link.name}
                    className="text-white hover:text-red-400 transition"
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
