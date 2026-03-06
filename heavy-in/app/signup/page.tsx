"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { SignupForm } from "@/components/signup-form";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  if (user) return null;

  const handleSignup = async (
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username,
        bio: "",
        avatarUrl: "/user.png",
        createdAt: serverTimestamp(),
      });

      router.push("/");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use")
        setError("Email je již obsazený.");
      else if (err.code === "auth/weak-password")
        setError("Heslo musí mít alespoň 6 znaků.");
      else setError("Chyba při registraci.");
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          HeavyIn
        </a>
        <SignupForm onSubmit={handleSignup} error={error} />
      </div>
    </div>
  );
}
