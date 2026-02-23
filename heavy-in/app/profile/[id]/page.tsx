import { db } from "@/app/firebase";
import WorkoutCard from "@/components/WorkoutCard";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Bookmark, Dumbbell, Settings } from "lucide-react";
import Image from "next/image";

async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const userRef = doc(db, "users", id);
  const userSnap = await getDoc(userRef);
  const rawData = userSnap.data();

  const user = {
    username: rawData?.username || "User",
    avatarUrl: rawData?.avatarUrl || "/user.png",
    bio: rawData?.bio || "No excuses, just heavy lifting.",
    followers: rawData?.followers || [],
    following: rawData?.following || [],
    createdWorkouts: rawData?.createdWorkoutsc || [],
  };

  if (!userSnap.exists()) return <div>Uživatel nenalezen</div>;

  const workoutsQuery = query(
    collection(db, "workouts"),
    where("userId", "==", id),
  );
  const workoutsSnap = await getDocs(workoutsQuery);
  const userWorkouts = workoutsSnap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toMillis() || Date.now(),
    };
  });

  const posts = workoutsSnap.size;

  return (
    <main>
      <header>
        <div className="flex justify-between">
          <div>My Account</div>
          <div>
            <Settings />
          </div>
        </div>

        <div className="grid items-center justify-center text-center gap-6">
          <div className="w-[250] h-[250] border overflow-hidden rounded-full relative">
            <Image src={user.avatarUrl} alt="" fill />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase">
              @{user?.username}
            </h2>
            <p>{user.bio}</p>
          </div>
        </div>

        <div className="flex justify-around text-center mt-8 border-b-2 border-heavy-border pb-4">
          <div className="grid items-center justify-center">
            <span className="text-3xl font-black">
              {posts}
            </span>
            <p className="text-heavy-muted">posts</p>
          </div>

          <div className="grid items-center justify-center">
            <span className="text-3xl font-black">{user.followers.length}</span>
            <p className="text-heavy-muted">followers</p>
          </div>

          <div className="grid items-center justify-center">
            <span className="text-3xl font-black">{user.following.length}</span>
            <p className="text-heavy-muted">following</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-8">
        <div className="flex gap-6">
          <button className="flex gap-2 border-b-2 pb-2 border-heavy-teal">
            <Dumbbell /> My workouts
          </button>

          <button className="flex gap-2">
            <Bookmark /> Saved
          </button>
        </div>

        <div>
          {userWorkouts.map((w) => {
            return <WorkoutCard key={w.id} data={w} />;
          })}
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
