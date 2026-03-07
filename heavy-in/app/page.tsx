"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Search } from "lucide-react";
import Link from "next/link";
import { WorkoutCard } from "@/components/workout-card";

export default function Home() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const q = query(collection(db, "workouts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const workoutsArr: any[] = [];

      QuerySnapshot.forEach((doc) => {
        workoutsArr.push({ ...doc.data(), id: doc.id });
      });

      setWorkouts(workoutsArr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-heavy-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Pulzující činka nebo logo */}
          <div className="w-12 h-12 bg-heavy-teal rounded-full animate-ping opacity-75" />
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-heavy-teal">
            Loading Heavy Data...
          </h2>
        </div>
      </div>
    );

  return (
    <main className="md:p-8 pb-30 max-w-7xl mx-auto p-4">
      <div className="relative w-full group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-heavy-muted group-focus-within:text-heavy-teal transition-colors">
          <Search size={20} strokeWidth={2.5} />
        </div>
        <form className="w-full">
          <input
            type="text"
            placeholder="Find athletes"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-heavy pl-12 w-full shadow-sm focus:shadow-md transition-shadow"
          />
        </form>
        {searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-heavy-card border-2 border-heavy-border rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in slide-in-from-top-2 z-2 duration-200">
            <div className="p-4 flex flex-col gap-3">
              {isSearching ? (
                <p className="p-4 text-center text-xs animate-pulse">
                  Searching...
                </p>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <Link href={`/profile/${user.id}`} key={user.id}>
                    <span className="font-bold uppercase">
                      {user.username || "Unknown Athlete"}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="p-4 text-center text-xs text-heavy-muted">
                  No athletes found.
                </p>
              )}

              <div className="h-px bg-heavy-border w-full" />

              <p className="text-[10px] uppercase tracking-widest text-heavy-muted text-center py-2">
                Searching for gains...
              </p>
            </div>
          </div>
        )}{" "}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <WorkoutCard data={workout} key={workout.id} />
          ))
        ) : (
          <p className="text-zinc-500 text-center py-10">
            No workouts found. Go lift something!
          </p>
        )}
      </div>
    </main>
  );
}
