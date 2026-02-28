"use client";

import { Flame, Share2, Zap } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";

interface WorkoutData {
  id: string;
  authorName?: string;
  userId: string;
  title: string;
  description: string;
  image: string;
  split: string;
  exercises: any[];
  createdAt?: any;
}

function WorkoutCard({ data }: { data: WorkoutData }) {
  const { id, userId, title, description, image, split, exercises = [] } = data;

  const exercisesCount = exercises.length;
  const [author, setAuthor] = useState<any>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchAuthor = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setAuthor(userSnap.data());
        }
      } catch (err) {
        console.error("Chyba při načítání autora:", err);
      }
    };

    fetchAuthor();
  }, [userId]);

  const formatedDate = data.createdAt?.toDate
    ? data.createdAt.toDate().toLocaleDateString()
    : data.createdAt instanceof Date
      ? data.createdAt.toLocaleDateString("cs-CZ")
      : "Neznámé datum";

  return (
    <div className="bg-heavy-card rounded my-6 shadow-sm">
      <div className="flex items-center justify-between p-3 pt-4">
        {/* user */}
        <div className="flex gap-2 items-center w-full">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-heavy-surface border border-heavy-border">
            <Image
              src={author?.avatarUrl || "/user.png"}
              alt={author?.username || "User"}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-sm leading-none text-heavy-main">
            {author?.username || "User"}
          </span>
          <span className="text-sm leading-none text-heavy-muted">{formatedDate}</span>
        </div>
        <button
          onClick={() =>
            navigator.share?.({
              title,
              url: window.location.origin + "/workout/" + id,
            })
          }
          className="p-2 hover:bg-heavy-surface rounded-full transition-colors text-heavy-teal"
        >
          <Share2 size={18} />
        </button>
      </div>

      {image ? (
        <Link href={`/workout/` + id}>
          <div className="w-full h-80 my-2 bg-heavy-surface relative">
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
        </Link>
      ) : null}

      <div className="p-4 grid gap-6">
        <Link href={`/workout/` + id}>
          <div className="space-y-2">
            <h3 className="font-black text-2xl uppercase italic tracking-tighter text-heavy-main leading-none">
              {title}
            </h3>

            <p className="text-sm text-heavy-muted leading-relaxed font-medium">
              {description}
            </p>
          </div>
        </Link>

        <div className="flex flex-wrap gap-2">
          <span className="flex gap-1.5 items-center bg-heavy-surface/40 px-3 py-1.5 rounded-full border border-heavy-border text-heavy-muted text-[11px] font-black uppercase tracking-wider">
            <Flame size={14} className="text-red-500 fill-red-500/20" />
            {exercisesCount || 0} exercises
          </span>

          <span className="flex gap-1.5 items-center bg-heavy-surface/40 px-3 py-1.5 rounded-full border border-heavy-border text-heavy-muted text-[11px] font-black uppercase tracking-wider">
            <Zap size={14} className="text-amber-400 fill-amber-400/20" />
            {split || "custom"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default WorkoutCard;
