"use client";

import { Bookmark, Flame, Heart, MessageCircle, Send, Zap } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
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
  likes: string[];
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  createdAt?: any;
}

function WorkoutCard({ data }: { data: any }) {
  const {
    id,
    authorName,
    title,
    description,
    image,
    split,
    exercises = [],
    likes = [],
    likeCount = 0,
    commentCount = 0,
    shareCount = 0,
  } = data;

  const exercisesCount = exercises.length;
  const [isSaved, setIsSaved] = useState(false);
  const { user: currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(likes.includes(currentUser?.uid));

  useEffect(() => {
    setIsLiked(likes.includes(currentUser?.uid));
  }, [likes, currentUser]);

  const handleLike = async () => {
    if (!currentUser) return alert("Musíš se přihlásit!");

    const workoutRef = doc(db, "workouts", id);
    const wasLiked = isLiked;

    setIsLiked(!wasLiked);

    try {
      await updateDoc(workoutRef, {
        likes: wasLiked
          ? arrayRemove(currentUser?.uid)
          : arrayUnion(currentUser?.uid),
        likeCount: wasLiked ? likeCount - 1 : likeCount + 1,
      });
    } catch (err) {
      console.error("Lajk se nepovedl:", err);
      setIsLiked(wasLiked); // Vrátíme zpět při chybě
    }
  };

  return (
    <div className="bg-heavy-card rounded my-6">
      <div className="flex items-center justify-between p-3 pt-4">
        {/* user */}
        <div className="flex gap-2 items-center w-full">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-heavy-surface border border-heavy-border">
            <Image
              src={"/cbum.avif"}
              alt={authorName || "User"}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-sm leading-none text-heavy-main">
            {authorName}
          </span>
          <span className="text-[10px] text-heavy-muted block uppercase tracking-widest">
            {data.createdAt?.toDate().toLocaleDateString()}
          </span>
        </div>
        <button className="px-5 py-1.5 bg-heavy-teal hover:bg-heavy-teal/90 text-white text-xs font-black uppercase tracking-tight rounded-lg transition-all active:scale-95 shadow-sm shrink-0">
          Follow
        </button>
      </div>

      <Link href={`/workout/` + id}>
        <div className="w-full h-80 my-2 bg-heavy-surface relative">
          <Image src={image} alt="" fill className="object-cover" />
        </div>
      </Link>

      <div className="p-4 grid gap-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-5">
            {/* LIKE */}
            <div className="flex gap-1.5 items-center">
              <button
                onClick={() => handleLike()}
                className={`group transition-all active:scale-125 ${isLiked ? "text-red-500" : "text-heavy-main hover:text-red-500"}`}
              >
                <Heart
                  size={22}
                  className={`transition-transform duration-200 ${isLiked ? "scale-110" : "group-hover:scale-110"}`}
                  fill={isLiked ? "currentColor" : "none"}
                />
              </button>
              <span
                className={`text-xs font-black tracking-tighter transition-colors ${isLiked ? "text-red-500" : "text-heavy-muted"}`}
              >
                {likes.length}
              </span>
            </div>

            {/* COMMENTS */}
            <div className="flex gap-1.5 items-center">
              <button className="text-heavy-main hover:text-heavy-teal transition-all active:scale-125 hover:scale-110">
                <MessageCircle size={22} />
              </button>
              <span className="text-xs font-black tracking-tighter text-heavy-muted">
                {commentCount || 0}
              </span>
            </div>

            {/* SHARE */}
            <div className="flex gap-1.5 items-center">
              <button className="text-heavy-main hover:text-heavy-teal transition-all active:rotate-12 active:scale-125 hover:scale-110">
                <Send size={22} />
              </button>
              <span className="text-xs font-black tracking-tighter text-heavy-muted">
                {shareCount || 0}
              </span>
            </div>
          </div>

          {/* BOOKMARK (SAVED) */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`transition-all active:scale-150 ${isSaved ? "text-yellow-300" : "text-heavy-main hover:text-yellow-300"}`}
          >
            <Bookmark
              size={22}
              className={`${isSaved ? "animate-[bounce_0.4s_ease-in-out]" : "hover:scale-110"}`}
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>

        <div className="space-y-2">
          {/* Nadpis */}
          <h3 className="font-black text-2xl uppercase italic tracking-tighter text-heavy-main leading-none">
            {title}
          </h3>

          {/* Popis */}
          <p className="text-sm text-heavy-muted leading-relaxed font-medium">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Exercises */}
          <span className="flex gap-1.5 items-center bg-heavy-surface/40 px-3 py-1.5 rounded-full border border-heavy-border text-heavy-muted text-[11px] font-black uppercase tracking-wider">
            <Flame size={14} className="text-red-500 fill-red-500/20" />
            {exercisesCount || 0} exercises
          </span>

          {/* Category */}
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
