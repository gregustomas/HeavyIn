"use client";

import WorkoutCard from "@/components/WorkoutCard";
import { DUMMY_WORKOUTS, USERS } from "./lib/data";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

export default function Home() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "workouts"), orderBy("createdAt", "desc"));

    // listener
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
      <div className="text-center py-20 uppercase font-black italic">
        Loading Heavy Data...
      </div>
    );

  return (
    <main className="md:p-8 pb-30 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-heavy-coral text-4xl font-black tracking-tighter uppercase">
          HeavyIn
        </h1>
        <p className="text-heavy-muted">Ready to lift heavy?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.length > 0 ? (
          workouts.map((workout) => <WorkoutCard data={workout} key={workout.id} />)
        ) : (
          <p className="text-zinc-500 text-center py-10">
            No workouts found. Go lift something!
          </p>
        )}
      </div>
    </main>
  );
}
