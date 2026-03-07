"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Flame, Share2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import Link from "next/link";

interface Exercise {
  id: string;
  note?: string;
}

interface WorkoutCardProps {
  id?: string;
  userId?: string;
  author?: string;
  avatarUrl?: string;
  createdAt?: Date | string;
  title?: string;
  description?: string;
  exercises?: Exercise[];
  split?: string;
  image?: string | null;
}

function formatDate(date: any): string {
  // Firestore Timestamp má metodu .toDate()
  const d = date?.toDate?.() ?? new Date(date);
  return d
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
    .replace(/\//g, ". ");
}

export function WorkoutCard({ data }: { data: WorkoutCardProps }) {
  const {
    id,
    author,
    avatarUrl,
    title,
    description,
    image,
    split,
    exercises = [],
    createdAt,
  } = data;

  const exercisesCount = exercises.length;

  return (
    <Card className="w-full max-w-md border-0 bg-card shadow overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <Link href={"/profile/" + author}>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl || "/user.png"} alt={author} />
              <AvatarFallback>
                {author?.charAt(0).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#5c5a57]">
                {author}
              </span>
              <span className="text-xs text-[#8a8580]">
                {formatDate(createdAt!)}
              </span>
            </div>
          </div>
        </Link>
        <button
          onClick={() =>
            navigator.share({
              title,
              url: `${window.location.origin}/workout/${id}`,
            })
          }
          className="text-[#4a9e9e] cursor-pointer hover:text-[#3d8585] transition-colors"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </CardHeader>

      {image && (
        <Link href={"/workout/" + id}>
          <div className="relative aspect-video w-full">
            <Image src={image} alt={title!} fill className="object-cover" />
          </div>
        </Link>
      )}

      <Link href={"/workout/" + id}>
        <CardContent className="space-y-2 pt-2">
          <h2 className="text-xl font-bold text-[#3d3b38] tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-[#6b6965] leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Link>

      <CardFooter className="flex gap-2 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9d4cc] bg-transparent px-3 py-1.5 text-xs font-semibold text-[#5c5a57] uppercase tracking-wide">
          <Flame className="h-3.5 w-3.5 text-[#e07850]" />
          {exercises.length} Exercises
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9d4cc] bg-transparent px-3 py-1.5 text-xs font-semibold text-[#5c5a57] uppercase tracking-wide">
          <Zap className="h-3.5 w-3.5 text-[#d4a048]" />
          {split}
        </span>
      </CardFooter>
    </Card>
  );
}
