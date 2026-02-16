import WorkoutCard from "@/components/WorkoutCard";
import { DUMMY_WORKOUTS, USERS } from "./lib/data";

export default function Home() {
  return (
    <main className="p-4 md:p-8 pb-30 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-heavy-coral text-4xl font-black tracking-tighter uppercase">
          HeavyIn
        </h1>
        <p className="text-heavy-muted">Ready to lift heavy?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_WORKOUTS.map((workout) => {
          const workoutAuthor = USERS.find((u) => u.id === workout.userId);
          const workoutData = {
            ...workout,
            user: {
              username: workoutAuthor?.username || "Unknown user",
              avatarUrl: workoutAuthor?.avatarUrl || "",
            },
          };

          return <WorkoutCard key={workout.id} data={workoutData} />;
        })}
      </div>
    </main>
  );
}
