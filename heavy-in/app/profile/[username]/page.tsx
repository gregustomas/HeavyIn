import { db } from "@/app/firebase";
import { WorkoutCard } from "@/components/workout-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

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
    <main className="max-w-xl mx-auto pb-10 bg-linear-to-b from-[#f5f5f5] to-background">
      <div className=" px-4 pt-10 pb-6 flex flex-col items-center text-center gap-4">
        <Avatar className="w-24 h-24 border-4 border-background shadow-lg ring-2 ring-heavy-teal/30">
          <AvatarImage
            src={user.avatarUrl || "/user.png"}
            alt={user.username}
          />
          <AvatarFallback className="text-2xl font-black bg-heavy-teal/10 text-heavy-teal">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="max-w-full overflow-hidden">
          {" "}
          {/* Obal pro jistotu */}
          <h2 className="text-2xl font-bold tracking">@{user.username}</h2>
          <p className="text-sm text-muted-foreground mt-1 wrap-break-word whitespace-pre-wrap max-w-xs mx-auto">
            {user.bio || "No excuses, just heavy lifting."}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-2">
          <div className="text-center">
            <p className="text-3xl font-black text-heavy-teal">
              {workoutsSnapshot.size}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
              Workouts
            </p>
          </div>
        </div>
      </div>

      {/* Workouts sekce */}
      <div className="px-4 space-y-4 mt-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Training Plans
        </p>
        {workoutsSnapshot.docs.map((w) => {
          const rawData = w.data();
          const workout = {
            ...rawData,
            id: w.id,
            createdAt: rawData.createdAt?.toDate?.()?.toISOString() || null,
          };

          return <WorkoutCard data={workout} key={w.id} />;
        })}
      </div>
    </main>
  );
}
