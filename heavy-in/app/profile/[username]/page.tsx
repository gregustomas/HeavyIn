import { db } from "@/app/firebase";
import { WorkoutCard } from "@/components/workout-card";
import { WorkoutData } from "@/components/WorkoutCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { Settings } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ username: string }>;
}

interface UserData {
  username: string;
  avatarUrl?: string;
  bio?: string;
}

async function getUserData(username: string): Promise<UserData | null> {
  const q = query(
    collection(db, "users"),
    where("username", "==", username.toLowerCase()),
    limit(1),
  );
  const querySnap = await getDocs(q);
  if (querySnap.empty) return null;
  return querySnap.docs[0].data() as UserData;
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const user = await getUserData(username);

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-2">
        <h1 className="text-4xl font-black uppercase italic opacity-20">404</h1>
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          @{username} not found
        </p>
      </main>
    );
  }

  const workoutsSnapshot = await getDocs(
    query(collection(db, "workouts"), where("author", "==", user.username)),
  );

  return (
    <main className="max-w-xl mx-auto p-4 pb-30 pt-8 space-y-6">
      {/* Avatar + Info */}
      <div className="flex flex-col items-center text-center gap-4">
        <Avatar className="w-24 h-24 border-2 border-border">
          <AvatarImage
            src={user.avatarUrl || "/user.png"}
            alt={user.username}
          />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-2xl font-black tracking-tighter uppercase">
            @{user.username}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            {user.bio || "No excuses, just heavy lifting."}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="border-y py-6 flex justify-around text-center">
        <div>
          <p className="text-4xl font-black">{workoutsSnapshot.size}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
            Workouts
          </p>
        </div>
      </div>

      {/* Workouts */}
      <div className="space-y-4">
        {workoutsSnapshot.docs.map((w) => {
          const rawData = w.data();
          const workout = {
            ...rawData,
            id: w.id,
            createdAt: rawData.createdAt?.toDate?.()?.toISOString() || null,
          } as WorkoutData;

          return <WorkoutCard data={workout} key={w.id} />;
        })}
      </div>
    </main>
  );
}
