"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
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
  const [mounted, setMounted] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    setMounted(true);

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

  const links = [
    { name: "Home", href: "/" },
    { name: "MyAnimeList", href: "/my-list" },
    { name: "AnimeFinder", href: "/anime/finder" },
    ...(mounted
      ? [
          !isLoggedIn ? { name: "Login", href: "/login" } : null,
          !isLoggedIn ? { name: "Signup", href: "/signup" } : null,
          isLoggedIn
            ? { name: "Logout", href: "#", onClick: handleLogout }
            : null,
        ]
      : [
          { name: "Login", href: "/login" },
          { name: "Signup", href: "/signup" },
        ]),
    { name: "About", href: "/about" },
  ].filter(Boolean);

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  return (
    <>
      <header className="bg-gray-900 sticky top-0 z-50 shadow-lg">
        <div className="p-4 sm:p-6 bg-[url('/header.png')] bg-cover bg-[center_25%] bg-blend-darken bg-black/50 w-full shadow-2xl">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              My AnimeWorld
            </h1>

            {/* Desktop links */}
            <nav className="hidden md:flex gap-6">
              {links.map((link) =>
                link.onClick ? (
                  <button
                    key={link.name}
                    onClick={link.onClick}
                    className="text-white hover:text-red-400 transition cursor-pointer"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-white hover:text-red-400 transition"
                  >
                    {link.name}
                  </Link>
                ),
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={toggleDrawer(true)}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded transition"
              aria-label="menu"
            >
              <MenuIcon fontSize="large" />
            </button>
          </div>
        </div>
      </header>

      {/* ✅ Drawer MUI rimane, ha senso usarlo */}
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
        <List className="w-64 bg-gray-800 h-full">
          {links.map((link) => (
            <ListItem key={link.name} disablePadding>
              {link.onClick ? (
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
