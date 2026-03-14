"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

import { getUnsplashImage } from "@/app/lib/unsplash";
import { CreateWorkoutForm } from "@/components/workout/CreateWorkoutForm";

function CreateWorkoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const handleSaveWorkout = async (data: {
    title: string;
    description: string;
    split: string;
    coverImage: string | null;
    exercises: any[];
  }) => {
    if (!user) {
      alert("Pro uložení tréninku se musíš přihlásit.");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      const realUsername = userData?.username ?? user.email?.split("@")[0];
      const avatarUrl = userData?.avatarUrl ?? "/user.png";

      await addDoc(collection(db, "workouts"), {
        userId: user.uid,
        author: realUsername,
        avatarUrl: avatarUrl,
        title: data.title,
        description: data.description,
        split: data.split,
        image: data.coverImage ?? (await getUnsplashImage()),
        exercises: data.exercises,
        createdAt: serverTimestamp(),
      });

      router.push("/");
    } catch (err) {
      console.error("Chyba při ukládání do Firestore:", err);
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <CreateWorkoutForm onPublish={handleSaveWorkout} />
    </div>
  );
}

export default CreateWorkoutPage;
