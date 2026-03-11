"use client";

import { db } from "@/app/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const SearchBar = () => {
  const [isSearching, setIsSearching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        const q = query(
          collection(db, "users"),
          where("username", ">=", searchTerm),
          where("username", "<=", searchTerm + "\uf8ff"),
          limit(5),
        );

        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((u) => ({
          id: u.id,
          ...u.data(),
        }));

        setSearchResults(users);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    setIsSearching(true);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="relative w-full group">
      {/* Input */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-heavy-teal transition-colors duration-200">
        <Search size={18} strokeWidth={2} />
      </div>
      <input
        type="text"
        placeholder="Find athletes..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full h-11 pl-11 pr-4 rounded-2xl border border-border bg-background text-sm font-medium placeholder:text-muted-foreground outline-none focus:border-heavy-teal focus:ring-2 focus:ring-heavy-teal/10 transition-all duration-200"
      />

      {/* Dropdown */}
      {searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-heavy-card border-2 border-heavy-border rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in slide-in-from-top-2 z-50 duration-200">
          <div className="p-3 flex flex-col gap-1">
            {isSearching ? (
              <p className="p-4 text-center text-xs animate-pulse">
                Searching...
              </p>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <Link
                  href={`/profile/${user.id}`}
                  key={user.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-heavy-border/40 transition-colors group/item"
                >
                  {/* Avatar initials */}
                  <div className="w-8 h-8 rounded-full bg-heavy-teal/15 text-heavy-teal flex items-center justify-center text-xs font-black uppercase shrink-0">
                    {user.username?.[0] ?? "?"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold uppercase tracking-tight leading-none">
                      {user.username || "Unknown Athlete"}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="p-4 text-center text-xs text-heavy-muted">
                No athletes found.
              </p>
            )}

            <div className="h-px bg-heavy-border w-full mt-1" />

            <p className="text-[10px] uppercase tracking-widest text-heavy-muted text-center py-2">
              Searching for gains...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
