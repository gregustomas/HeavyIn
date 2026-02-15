import Navbar from "@/components/Navbar";
import WorkoutCard from "@/components/WorkoutCard";
import Image from "next/image";

const USERS = [
  {
    id: "u1",
    username: "tom_swole_",
    email: "tom@heavyin.com",
    workoutsCreated: 15,
    avatarUrl: "",
  },
];

const DUMMY_WORKOUTS = [
  {
    id: "w1",
    userId: "u1",
    title: "Upper/Lower: A",
    description:
      "Dneska to byl masakr. Bench press šel nahoru jako nic. Příště přihodíme další kotouč!...",
    split: "Full Body",
    exercises: [
      {
        exercise: "Bench",
        sets: 2,
        note: "Focus on contraction",
      },
    ],
    time: 90,
    stats: { likes: 123, commentsCount: 12, shares: 3 },
    interactions: {
      liked: false,
      saved: false,
      shared: false,
      comments: [
        { id: "c1", username: "gym_rat", text: "Brutální forma! 🔥" },
        { id: "c2", username: "fitness_girl", text: "Ten split vypadá super." },
      ],
    },
  },
  {
    id: "w1",
    userId: "u1",
    title: "Upper/Lower: A",
    description:
      "Dneska to byl masakr. Bench press šel nahoru jako nic. Příště přihodíme další kotouč!...",
    split: "Full Body",
    exercises: [
      {
        exercise: "Bench",
        sets: 2,
        note: "Focus on contraction",
      },
    ],
    time: 90,
    stats: { likes: 123, commentsCount: 12, shares: 3 },
    interactions: {
      liked: false,
      saved: false,
      shared: false,
      comments: [
        { id: "c1", username: "gym_rat", text: "Brutální forma! 🔥" },
        { id: "c2", username: "fitness_girl", text: "Ten split vypadá super." },
      ],
    },
  },
];

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
