"use client";

import { usePathname } from "next/navigation";
import { AvatarDropdown } from "../profile/AvatarDropdown";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "../ui/button";

function Topbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  function getTitle() {
    if (pathname.startsWith("/profile/")) return "Profile";
    //if (pathname.startsWith("/profile/")) return "@" + pathname.split("/")[2];

    const titles: Record<string, string> = {
      "/": "Explore",
      "/login": "Login",
      "/signup": "Signup",
      "/create": "Create",
    };

    return titles[pathname] ?? "HeavyIn";
  }

  if (pathname === "/create") return null;
  if (pathname === "/login") return null;
  if (pathname === "/signup") return null;

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b w-full max-w-2xl mx-auto">
      <div className="max-w-2xl mx-auto flex justify-between items-center h-14 px-4">
        <h1 className="text-heavy-teal text-3xl font-black tracking-tighter uppercase">
          {getTitle()}
        </h1>
        {user ? (
          <AvatarDropdown />
        ) : (
          <Button variant="outline" size="sm">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}

export default Topbar;
