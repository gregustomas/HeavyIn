"use client";

import {
  Bookmark,
  Flame,
  Heart,
  MessageCircle,
  Send,
  User,
  Zap,
} from "lucide-react";
import Image from "next/image";
import cbum from "../app/cbum.avif";
import { useState } from "react";
import Link from "next/link";

interface WorkoutData {
  id: string;
  user: {
    username: string;
    avatarUrl?: string;
  };
  title: string;
  description: string;
  split: string;
  exercises: { exercise: string; sets: number; note: string }[];
  time: number;
  stats: {
    likes: number;
    commentsCount: number;
    shares: number;
  };
}

function WorkoutCard({ data }: { data: WorkoutData }) {
  const {
    id,
    user,
    title,
    description,
    split,
    exercises,
    time,
    stats: { likes, commentsCount, shares }, // <--- TOHLE JE ONO
  } = data;

  const exercisesCount = exercises.length;
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="bg-heavy-card rounded my-6">
      <div className="flex items-center justify-between p-3 pt-4">
        <div className="flex gap-2 items-center w-full">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-heavy-surface border border-heavy-border">
            <Image
              src={user.avatarUrl || cbum}
              alt={user.username}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-sm leading-none text-heavy-main">
            {user.username}
          </span>
        </div>
        <button className="px-5 py-1.5 bg-heavy-teal hover:bg-heavy-teal/90 text-white text-xs font-black uppercase tracking-tight rounded-lg transition-all active:scale-95 shadow-sm shrink-0">
          Follow
        </button>
      </div>

      <Link href={`http://localhost:3000/workout/` + id}>
        <div className="w-full h-80 my-2 bg-heavy-surface relative">
          <Image src={cbum} alt="" fill className="object-cover" />
        </div>
      </Link>

      <div className="p-4 grid gap-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-5">
            {/* LIKE */}
            <div className="flex gap-1.5 items-center">
              <button
                onClick={() => setIsLiked(!isLiked)}
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
                {(likes || 0) + (isLiked ? 1 : 0)}
              </span>
            </div>

            {/* COMMENTS */}
            <div className="flex gap-1.5 items-center">
              <button className="text-heavy-main hover:text-heavy-teal transition-all active:scale-125 hover:scale-110">
                <MessageCircle size={22} />
              </button>
              <span className="text-xs font-black tracking-tighter text-heavy-muted">
                {commentsCount || 0}
              </span>
            </div>

            {/* SHARE */}
            <div className="flex gap-1.5 items-center">
              <button className="text-heavy-main hover:text-heavy-teal transition-all active:rotate-12 active:scale-125 hover:scale-110">
                <Send size={22} />
              </button>
              <span className="text-xs font-black tracking-tighter text-heavy-muted">
                {shares || 0}
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

          {/* Time */}
          <span className="flex gap-1.5 items-center bg-heavy-surface/40 px-3 py-1.5 rounded-full border border-heavy-border text-heavy-muted text-[11px] font-black uppercase tracking-wider">
            <Zap size={14} className="text-heavy-teal fill-heavy-teal/20" />
            {time || 0} min
          </span>
        </div>
      </div>
    </div>
  );
}

export default WorkoutCard;
