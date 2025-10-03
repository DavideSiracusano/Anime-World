"use client";

import Link from "next/link";
import { useState } from "react";
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

function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "MyAnimeList", href: "/MyAnimeList" },
    { name: "AnimeFinder", href: "/AnimeFinder" },
    { name: "About", href: "/About" },
  ];

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  return (
    <>
      {/* Barra superiore */}
      <AppBar position="static">
        <div className="p-4 sm:p-6 bg-[url('/header.png')] bg-cover bg-[center_25%] bg-blend-darken bg-black/50 w-full shadow-2xl">
          <Toolbar className="flex justify-between items-center ">
            {/* Titolo responsive */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              AnimeWorld
            </h1>

            {/* Link desktop */}
            <div className="hidden md:flex gap-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-red-400 transition"
                >
                  {link.name}
                </Link>
              ))}
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
        <List className="w-64 bg-gray-800 h-full">
          {links.map((link) => (
            <ListItem key={link.name} disablePadding>
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
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
