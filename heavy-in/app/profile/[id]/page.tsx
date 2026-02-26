import { db } from "@/app/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Settings } from "lucide-react";
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
    createdWorkouts: rawData?.createdWorkouts || [],
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
            <span className="text-3xl font-black">{posts}</span>
            <p className="text-heavy-muted">posts</p>
          </div>
        </div>
      </header>
    </main>
  );
}

export default ProfilePage;
