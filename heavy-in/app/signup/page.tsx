"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { SignupForm } from "@/components/signup-form";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { signupSchema } from "../lib/schemas";
import { useRouter } from "next/navigation";
import { handleGoogleAuth } from "@/lib/utils";

export default function SignupPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    const result = signupSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    const usernameRef = doc(db, "usernames", username);
    const usernameSnap = await getDoc(usernameRef);
    if (usernameSnap.exists()) {
      setError("Username je již obsazený.");
      return;
    }

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

      await setDoc(usernameRef, { uid: user.uid });

      const token = await user.getIdToken();
      document.cookie = `auth-token=${token}; path=/; max-age=3600`;
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
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="text-xl font-bold tracking-tight self-center">
          HEAVYIN
        </a>
        <SignupForm
          onSubmit={handleSignup}
          onGoogleLogin={() => handleGoogleAuth(router)}
          error={error}
        />
      </div>
    </div>
  );
}
