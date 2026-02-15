import { ReactNode } from "react";

interface HeaderProps {
  children: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return <header className="bg-gray-800 text-white p-4">{children}</header>;
}
