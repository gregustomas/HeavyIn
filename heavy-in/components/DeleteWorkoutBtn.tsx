"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Button } from "./ui/button";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useRouter } from "next/navigation";

interface Props {
  workoutId: string;
  authorId: string;
}

export default function DeleteWorkoutBtn({ workoutId, authorId }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  if (user?.uid !== authorId) return null;

  const handleDelete = async () => {
    await deleteDoc(doc(db, "workouts", workoutId));
    router.push("/");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Smazat workout?</AlertDialogTitle>
          <AlertDialogDescription>
            Tato akce je nevratná. Workout bude trvale smazán.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Zrušit</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Smazat</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
