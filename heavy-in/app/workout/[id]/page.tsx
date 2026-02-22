import { db } from "@/app/firebase";
import { USERS } from "@/app/lib/data";
import BackBtn from "@/components/BackBtn";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function WorkoutDetailPage({ params }: PageProps) {
  const { id } = await params;

  const workoutRef = doc(db, "workouts", id); // reference na kolekci
  const workouSnap = await getDoc(workoutRef); // získání dat

  // kontrola jestli data existují
  if (!workouSnap.exists()) {
    return (
      <main className="p-4 text-heavy-main bg-heavy-bg">
        Workout nebyl nalezen.
      </main>
    );
  }

  const workout = workouSnap.data() as any;
  const user = USERS.find((u) => u.id === workout?.userId) || {
    username: "User",
    avatarUrl: "/cbum.avif",
  };

  return (
    <main className="min-h-screen bg-heavy-bg text-heavy-main pb-20 relative">
      <div className="absolute top-4 left-4 z-10">
        <BackBtn link="/" />
      </div>

      {/* Hero Header s obrázkem */}
      <div className="relative w-full h-112.5">
        <Image
          src={workout.image || "/cbum.avif"}
          alt={workout.title}
          fill
          priority
          className="object-cover"
        />
        {/* Gradient pro čitelnost postavený na tvém pozadí */}
        <div className="absolute inset-0 bg-linear-to-t from-heavy-bg via-transparent to-black/20" />

        {/* Title Over Image */}
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <div className="flex gap-2 mb-3">
            <span className="bg-heavy-teal text-heavy-bg text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
              {workout.split}
            </span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-[0.85] text-white">
            {workout.title}
          </h1>
        </div>
      </div>

      {/* Obsah pod obrázkem */}
      <div className="px-6 py-8 space-y-10">
        {/* Profil autora */}
        <div className="flex items-center justify-between gap-3 p-4 bg-heavy-card rounded-2xl border border-heavy-border shadow-inner">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-heavy-teal/30">
              <Image
                src={user.avatarUrl || "/cbum.avif"}
                alt={user.username}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[10px] font-black text-heavy-teal uppercase tracking-[0.2em] leading-none mb-1">
                Created by
              </p>
              <p className="font-bold text-lg leading-none">{user.username}</p>
            </div>
          </div>

          <button className="px-5 py-1.5 bg-heavy-teal hover:bg-heavy-teal/90 text-white text-xs font-black uppercase tracking-tight rounded-lg transition-all active:scale-95 shadow-sm shrink-0">
            Follow
          </button>
        </div>

        {/* Popis */}
        <p className="text-heavy-muted text-lg leading-snug italic font-medium border-l-4 border-heavy-teal pl-5">
          "{workout.description}"
        </p>

        {/* Seznam cviků */}
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
              <div
                key={index}
                className="group flex justify-between items-center p-5 bg-heavy-card rounded-3xl border border-heavy-border hover:border-heavy-teal/40 transition-all duration-500"
              >
                <div className="flex gap-5 items-center">
                  <span className="text-heavy-border font-black text-3xl italic group-hover:text-heavy-teal/20 transition-colors">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-black uppercase italic text-heavy-main text-xl leading-none">
                      {ex.name}
                    </h3>
                    <p className="text-heavy-muted text-xs mt-1.5 font-medium tracking-wide">
                      {ex.note}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-black text-heavy-main leading-none">
                    {ex.sets}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-heavy-teal mt-1">
                    Sets
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default WorkoutDetailPage;
