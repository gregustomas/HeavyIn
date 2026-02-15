import { Bookmark, Home, Plus, Search, User } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
}

function Navbar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-(--bg-secondary)/70 backdrop-blur-xl border-t border-heavy-border w-full flex items-center justify-center px-6 py-3 z-50">
      <div className="flex items-center justify-around">
        <NavLink href="/" icon={<Home size={24} />} label="Home" />
        <NavLink href="/Explore" icon={<Search size={24} />} label="Explore" />
        <NavLink href="/CreatePlan" icon={<Plus size={24} />} label="Create" />
        <NavLink
          href="/SavedPlans"
          icon={<Bookmark size={24} />}
          label="Saved"
        />
        <NavLink href="/Profile" icon={<User size={24} />} label="Profile" />
      </div>
    </nav>
  );
}

export default Navbar;

function NavLink({ href, icon, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center text-heavy-muted hover:text-heavy-main py-2 px-3 transition-all duration-200"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
