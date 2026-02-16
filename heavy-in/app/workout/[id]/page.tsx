import { DUMMY_WORKOUTS } from "@/app/lib/data";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function page({ params }: PageProps) {
  const { id } = await params;
  const workout = DUMMY_WORKOUTS.find((w) => w.id === id);

  if (!workout) {
    return <main className="p-4">Workout nebyl nalezen.</main>;
  }

  return (
    <main>
      <div className="w-full p-4">
        <span className="flex gap-1 items-center">
          <ArrowLeft />
          Back
        </span>
      </div>

      <h2>{workout.title}</h2>
    </main>
  );
}

export default page;
