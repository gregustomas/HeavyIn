"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Home, Plus, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface CustomUser {
  uid: string;
  username?: string;
}

function Navbar() {
  const { user, loading } = useAuth() as {
    user: CustomUser | null;
    loading: boolean;
  };
  const pathname = usePathname();
  const router = useRouter();

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!user?.username) {
      e.preventDefault();
      router.push(
        `/login?message=${encodeURIComponent("Pro zobrazení profilu se musíš přihlásit.")}`,
      );
    }
  };

  if (pathname === "/login" || pathname === "/signup") return null;

  if (loading) {
    return <nav className="...">Načítání...</nav>;
  }

  const profileHref = user?.username ? `/profile/${user.username}` : "/login";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur border-t w-full flex items-center justify-center px-6 py-2 z-40">
      <div className="flex items-center justify-around gap-10">
        <NavLink href="/" icon={<Home size={22} />} label="Home" />
        <NavLink href="/create" icon={<Plus size={22} />} label="Create" />
        <NavLink
          href={profileHref}
          onClick={handleProfileClick}
          icon={<User size={22} />}
          label="Profile"
        />
      </div>
    </nav>
  );
}

export default Navbar;

function NavLink({ href, icon, label, onClick }: NavLinkProps) {
  return (
    <Link
      onClick={onClick}
      href={href}
      className="flex flex-col items-center text-heavy-muted hover:text-heavy-main py-2 px-3 transition-all duration-200"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
