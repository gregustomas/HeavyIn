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
import Link from "next/link";
import ShareBtn from "./ShareBtn";
import { formatDate } from "@/lib/utils";
import UserCard from "./UserCard";
import { Badge } from "./ui/badge";

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

  return (
    <Card className="w-full max-w-md border-0 bg-card shadow overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <UserCard author={author} avatarUrl={avatarUrl} date={createdAt} />
        <ShareBtn id={id} title={title} />
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
        <Badge variant="outline" className="gap-1.5">
          <Flame className="h-3.5 w-3.5 text-orange-400" />
          {exercises.length} Exercises
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <Zap className="h-3.5 w-3.5 text-yellow-500" />
          {split}
        </Badge>
      </CardFooter>
    </Card>
  );
}
