"use client";

import { usePathname } from "next/navigation";
import { AvatarDropdown } from "./ui/AvatarDropdown";

function Topbar() {
  const pathname = usePathname();

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

  return (
    <header className='class="top-0 z-50 sticky bg-background/95 supports-backdrop-filter:bg-background/60 shadow-sm backdrop-blur border-b w-full"'>
      <div className="flex justify-between items-center h-16 cs-container p-4">
        <h1 className="text-heavy-teal text-4xl font-black tracking-tighter uppercase">
          {getTitle()}
        </h1>

        <AvatarDropdown />
      </div>
    </header>
  );
}

export default Topbar;
