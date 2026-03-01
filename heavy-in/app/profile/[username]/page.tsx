import { db } from "@/app/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { Settings } from "lucide-react";
import Image from "next/image";

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
      <main className="min-h-screen bg-heavy-bg text-heavy-main flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-black uppercase italic opacity-20">404</h1>
        <p className="font-bold uppercase tracking-widest">
          Uživatel @{username} nenalezen
        </p>
      </main>
    );
  }

  const workoutsSnap = await getDocs(
    query(collection(db, "workouts"), where("userAuthor", "==", user.username)),
  );

  return (
    <main className="min-h-screen bg-heavy-bg text-heavy-main p-6">
      <header className="max-w-xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <div className="font-black uppercase tracking-widest text-[10px] opacity-50">
            My Account
          </div>
          <Settings className="w-5 h-5 cursor-pointer hover:rotate-90 transition-transform duration-300" />
        </div>

        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-45 h-45 border-2 border-heavy-teal/20 p-1 rounded-full relative">
            <div className="w-full h-full rounded-full overflow-hidden relative border border-heavy-teal/40">
              <Image
                src={user.avatarUrl || "/user.png"}
                alt={user.username}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">
              @{user.username}
            </h2>
            <p className="text-heavy-muted text-sm max-w-xs mx-auto leading-tight">
              {user.bio || "No excuses, just heavy lifting."}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-around text-center mt-12 border-y border-heavy-border/50 py-8">
          <div className="grid items-center justify-center">
            <span className="text-5xl font-black leading-none">
              {workoutsSnap.size}
            </span>
            <p className="text-heavy-muted uppercase text-[10px] font-bold tracking-[0.3em] mt-2">
              Workouts
            </p>
          </div>
        </div>
      </header>
    </main>
  );
}
