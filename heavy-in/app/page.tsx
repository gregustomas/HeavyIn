"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { WorkoutCard } from "@/components/workout-card";
import SearchBar from "@/components/searchBar";

export default function Home() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      <SearchBar />
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
