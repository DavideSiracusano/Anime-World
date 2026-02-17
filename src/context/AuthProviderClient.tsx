"use client";

import { AuthProvider } from "./AuthContext";
import { ReactNode } from "react";

interface AuthProviderClientProps {
  children: ReactNode;
}

export function AuthProviderClient({ children }: AuthProviderClientProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
