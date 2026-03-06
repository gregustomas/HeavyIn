import { db } from "@/app/firebase";
import BackBtn from "@/components/BackBtn";
import ExerciseCard from "@/components/ExerciseCard";
import { doc, getDoc } from "firebase/firestore";
import { Metadata } from "next";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const snap = await getDoc(doc(db, "workouts", id));
  const data = snap.data();

  return {
    title: `${data?.title || "Workout"} | HeavyIn`,
    description: data?.description || "Check out this training plan on HeavyIn",
    openGraph: {
      images: [data?.image || "/cbum.avif"],
    },
  };
}

async function WorkoutDetailPage({ params }: PageProps) {
  const { id } = await params;
  const workoutRef = doc(db, "workouts", id); // reference na kolekci
  const workoutSnap = await getDoc(workoutRef); // získání dat
  if (!workoutSnap.exists()) {
    return (
      <main className="p-4 text-heavy-main bg-heavy-bg">
        Workout nebyl nalezen.
      </main>
    );
  }
  const workout = workoutSnap.data() as any;

  const userRef = doc(db, "users", workout.userId);
  const userSnap = await getDoc(userRef);
  const user = userSnap.exists()
    ? userSnap.data()
    : { username: "User", avatarUrl: "/user.png" };

  return (
    <main className="md:p-8 pb-30 max-w-7xl mx-auto relative">
      <div className="absolute top-6 right-4 z-10">
        <BackBtn link="/" />
      </div>

      <div className="relative w-full h-100">
        <Image
          src={workout.image || "/cbum.avif"}
          alt={workout.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-heavy-bg via-transparent to-black/20" />

        <div className="absolute bottom-0 left-0 p-4 pb-2 w-full">
          <div className="flex gap-2 mb-3">
            <span className="bg-heavy-teal text-heavy-bg text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
              {workout.split}
            </span>
          </div>

          <h1 className="text-6xl font-black uppercase tracking-tighter leading-[0.8] text-heavy-main">
            {workout.title}
          </h1>
        </div>
      </div>

      <div className="px-6 py-8 space-y-10">
        <p className="text-heavy-muted text-lg leading-snug italic font-medium border-l-4 border-heavy-teal pl-5">
          {workout.description}
        </p>

        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-heavy-border pb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-heavy-muted">
              Training Plan
            </h2>
            <span className="text-[10px] font-bold text-heavy-teal uppercase">
              {workout.exercises.length} Exercises
            </span>
          </div>

          <div className="grid gap-4">
            {workout.exercises?.map((ex: any, index: number) => (
              <ExerciseCard index={index} data={ex} key={index} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default WorkoutDetailPage;
