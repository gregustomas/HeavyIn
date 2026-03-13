"use client";

import { useAuth } from "@/app/context/AuthContext";
import { auth, db } from "@/app/firebase";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteUser } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const DeleteAccountBtn = () => {
  const { user } = useAuth();
  const router = useRouter();
  const handleDeleteAccount = async () => {
    if (!auth.currentUser || !user) return;

    try {
      // 1. Smaž všechny workouty
      const workoutsSnap = await getDocs(
        query(collection(db, "workouts"), where("userId", "==", user.uid)),
      );
      const batch = writeBatch(db);
      workoutsSnap.docs.forEach((w) => batch.delete(w.ref));

      // Smaž username
      if (user.username) {
        batch.delete(doc(db, "usernames", user.username));
      }

      await batch.commit();

      // 2. Smaž Firestore user doc
      await deleteDoc(doc(db, "users", user.uid));

      toast.success("Účet byl úspěšně smazán.", { position: "top-center" });

      // 3. Smaž Firebase Auth user
      await deleteUser(auth.currentUser);

      router.push("/login");
    } catch (err: any) {
      if (err.code === "auth/requires-recent-login")
        toast.error("Z bezpečnostních důvodů se prosím znovu přihlas.", {
          position: "top-center",
        });
      else toast.error("Chyba při mazání účtu.", { position: "top-center" });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="hover:bg-red-500 w-full sm:w-auto"
        >
          Smazat účet
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Opravdu chceš skončit?</AlertDialogTitle>
          <AlertDialogDescription>
            Tato akce trvale smaže tvůj účet a všechny tvoje tréninky. Tohle
            nejde vzít zpět.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-lg">Zrušit</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg border-none"
            onClick={handleDeleteAccount}
          >
            Smazat navždy
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
