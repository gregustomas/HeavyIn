"use client";

import { Bookmark, Dumbbell } from "lucide-react";
import { useState } from "react";
import WorkoutCard from "./WorkoutCard";

interface ProfileTabsProps {
  myWorkouts: any[];
  savedWorkouts: any[];
}

function ProfileTabs({
  myWorkouts: initialMy,
  savedWorkouts: initialSaved,
}: any) {
  const [activeTab, setActiveTab] = useState<"my" | "saved">("my");

  const [myWorkouts, setMyWorkouts] = useState(initialMy);
  const [savedWorkouts, setSavedWorkouts] = useState(initialSaved);

  const updateWorkoutInState = (workoutId: string, newLikes: string[]) => {
    const updateFn = (list: any[]) =>
      list.map((w) => (w.id === workoutId ? { ...w, likes: newLikes } : w));

    setMyWorkouts(updateFn);
    setSavedWorkouts(updateFn);
  };

  return (
    <div className="px-4 py-8">
      <div className="flex gap-6 mb-6">
        <button
          onClick={() => setActiveTab("my")}
          className={`flex gap-2 pb-2 border-b-2 transition-colors ${
            activeTab === "my"
              ? "border-heavy-teal text-heavy-teal"
              : "border-transparent text-heavy-muted"
          }`}
        >
          <Dumbbell /> My workouts
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex gap-2 pb-2 border-b-2 transition-colors ${
            activeTab === "saved"
              ? "border-heavy-teal text-heavy-teal"
              : "border-transparent text-heavy-muted"
          }`}
        >
          <Bookmark /> Saved
        </button>
      </div>

      <div className="grid gap-2">
        {activeTab === "my" ? (
          myWorkouts.length > 0 ? (
            myWorkouts.map((w: any) => (
              <WorkoutCard
                key={w.id}
                data={w}
                onLikeUpdate={updateWorkoutInState}
              />
            ))
          ) : (
            <p className="text-center text-heavy-muted py-10">
              Zatím jsi nevytvořil žádný trénink.
            </p>
          )
        ) : savedWorkouts.length > 0 ? (
          savedWorkouts.map((w: any) => (
            <WorkoutCard
              key={w.id}
              data={w}
              onLikeUpdate={updateWorkoutInState}
            />
          ))
        ) : (
          <p className="text-center text-heavy-muted py-10">
            Nemáš uložené žádné tréninky.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfileTabs;
