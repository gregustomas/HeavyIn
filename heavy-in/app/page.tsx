"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import { WorkoutCard } from "@/components/workout-card";
import SearchBar from "@/components/searchBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [splitFilter, setSplitFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const filteredWorkouts = workouts
    .filter((w) =>
      splitFilter === "all" ? true : w.split?.toLowerCase() === splitFilter,
    )
    .sort((a, b) => {
      const dateA = a.createdAt?.toDate?.()?.getTime() ?? 0;
      const dateB = b.createdAt?.toDate?.()?.getTime() ?? 0;
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

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
    <main className="md:p-8 pb-10 max-w-7xl mx-auto p-4 pt-5 bg-[#f5f5f5]">
      <div>
        <SearchBar />
        <div className="flex gap-2 my-4">
          <Button
            variant="outline"
            className="h-9 w-28 text-sm"
            onClick={() =>
              setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
            }
          >
            {sortOrder === "desc" ? "Newest ↓" : "Oldest ↑"}
          </Button>

          <Select value={splitFilter} onValueChange={setSplitFilter}>
            <SelectTrigger className="w-36 h-9 text-sm bg-background">
              <SelectValue placeholder="All splits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All splits</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
              <SelectItem value="fullbody">Fullbody</SelectItem>
              <SelectItem value="upper">Upper</SelectItem>
              <SelectItem value="lower">Lower</SelectItem>
              <SelectItem value="push">Push</SelectItem>
              <SelectItem value="pull">Pull</SelectItem>
              <SelectItem value="legs">Legs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map((workout) => (
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
