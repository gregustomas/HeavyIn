import { db } from "@/app/firebase";
import { WorkoutCard } from "@/components/workout-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import Link from "next/link";
import { Plus } from "lucide-react";

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
    <main className="pb-24">
      {/* Profile header – bílá karta */}
      <div className="bg-background border-b">
        <div className="page-container pb-6 flex flex-col items-center text-center gap-3">
          <Avatar className="w-20 h-20 ring-2 ring-heavy-teal/20">
            <AvatarImage
              src={user.avatarUrl || "/user.png"}
              alt={user.username}
            />
            <AvatarFallback className="text-xl font-semibold bg-heavy-teal/10 text-heavy-teal">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">@{user.username}</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              {user.bio || "No excuses, just heavy lifting."}
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-heavy-teal">
              {workoutsSnapshot.size}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
              Workouts
            </p>
          </div>
        </div>
      </div>

      {/* Workouts */}
      {/* Workouts */}
      <div className="page-container pt-4 space-y-4">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Training Plans
        </p>
        {workoutsSnapshot.size === 0 ? (
          <div className="flex flex-col items-center text-center py-12 gap-3">
            <p className="text-sm text-muted-foreground">
              No training plans yet.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-heavy-teal hover:text-heavy-teal text-sm font-medium bg-heavy-teal hover:bg-white text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create workout
            </Link>
          </div>
        ) : (
          workoutsSnapshot.docs.map((w) => {
            const rawData = w.data();
            const workout = {
              ...rawData,
              id: w.id,
              createdAt: rawData.createdAt?.toDate?.()?.toISOString() || null,
            };
            return <WorkoutCard data={workout} key={w.id} />;
          })
        )}
      </div>
    </main>
  );
}
