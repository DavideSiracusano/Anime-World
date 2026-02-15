"use client";

import Link from "next/link";
import { useState } from "react";
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
import { useAuth } from "@/context/AuthContext";

interface NavLink {
  name: string;
  href: string;
  onClick?: () => void;
}

export default function Navbar() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const links: NavLink[] = [
    { name: "Home", href: "/" },
    { name: "MyAnimeList", href: "/my-list" },
    { name: "AnimeFinder", href: "/anime/finder" },
    { name: "Topics", href: "/topics" },
    ...(!user
      ? [
          { name: "Login", href: "/login" },
          { name: "Signup", href: "/signup" },
        ]
      : [
          {
            name: `Logout (${user.name})`,
            href: "#",
            onClick: handleLogout,
          },
        ]),
    { name: "About", href: "/about" },
  ];

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  return (
    <>
      <header className="bg-gray-900 sticky top-0 z-50 shadow-lg">
        <div className="p-4 sm:p-6 bg-[url('/header.png')] bg-cover bg-[center_25%] bg-blend-darken bg-black/50 w-full shadow-2xl">
          <div className="flex justify-between items-center">
            {loading ? (
              <div className="invisible" />
            ) : user ? (
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Ciao, {user.name}!
              </h1>
            ) : (
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Benvenuto su AnimeWorld
              </h1>
            )}

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
                    link.onClick?.();
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
