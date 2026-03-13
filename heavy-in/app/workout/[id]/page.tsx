import { db } from "@/app/firebase";
import DeleteWorkoutBtn from "@/components/DeleteWorkoutBtn";
import ExerciseCard from "@/components/ExerciseCard";
import ShareBtn from "@/components/ShareBtn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UserCard from "@/components/UserCard";
import { doc, getDoc } from "firebase/firestore";
import { Flame, Zap } from "lucide-react";
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
    openGraph: { images: [data?.image || "/cbum.avif"] },
  };
}

async function WorkoutDetailPage({ params }: PageProps) {
  const { id } = await params;
  const workoutSnap = await getDoc(doc(db, "workouts", id));

  if (!workoutSnap.exists()) {
    return <main className="p-4">Workout nebyl nalezen.</main>;
  }

  const workout = workoutSnap.data() as any;
  const {
    title,
    description,
    image,
    split,
    exercises,
    author,
    avatarUrl,
    createdAt,
  } = workout;

  return (
    <main className="pb-24">
      <div className="relative w-full h-56 md:h-72">
        <Image
          src={image || "/cbum.avif"}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4">
          <DeleteWorkoutBtn workoutId={id} authorId={workout.userId} />
        </div>
      </div>

      <div className="page-container pt-0">
        <Card className="-mt-6 relative z-10 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex justify-between items-start mb-3">
              <UserCard
                author={author}
                avatarUrl={avatarUrl}
                date={createdAt}
              />
              <ShareBtn title={title} id={id} />
            </div>
            <h2 className="font-semibold text-lg">{title}</h2>
            {description && (
              <p className="text-muted-foreground text-sm mt-1">
                {description}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <Badge variant="outline" className="gap-1.5">
                <Flame className="h-3.5 w-3.5 text-orange-400" />
                {exercises.length} Exercises
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Zap className="h-3.5 w-3.5 text-yellow-500" />
                {split}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Exercises
            </span>
            <span className="text-xs text-muted-foreground">
              Total {exercises.length}
            </span>
          </div>
          <div className="grid gap-2">
            {exercises.map((exercise, index) => (
              <ExerciseCard data={exercise} index={index} key={index} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default WorkoutDetailPage;
