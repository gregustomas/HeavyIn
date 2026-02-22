"use client";

import Button from "@/components/Button";
import { FormField } from "@/components/FormField";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/navigation";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

function SignupPage() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (user) return null;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Hesla se neshodují.");
      return;
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        password,
      );
      const user = userCredentials.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: userData.username,
        bio: "",
        avatarUrl: "/user.png",
        likedWorkouts: [],
        savedWorkouts: [],
        createdWorkouts: [],
        createdAt: serverTimestamp(),
      });
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Tento e-mail už je obsazený.");
      } else if (err.code === "auth/weak-password") {
        setError("Heslo musí mít alespoň 6 znaků.");
      } else {
        setError("Chyba při registraci: " + err.message);
      }
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-center px-6">
      <div className="max-w-sm mx-auto w-full">
        <header className="mb-12">
          <h1 className="text-6xl font-black uppercase italic leading-none tracking-tighter">
            HEAVY<span className="text-heavy-teal text-outline">IN</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">
            Strength & Discipline / Sign up
          </p>
        </header>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border-l-4 border-red-600 p-4 mb-4">
              <p className="text-red-500 font-black text-xs tracking-widest">
                {error}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <FormField label="Username">
              <input
                type="text"
                placeholder="USERNAME"
                className="w-full bg-zinc-900 border-none p-4 text-white font-bold placeholder:text-zinc-700 focus:ring-2 focus:ring-heavy-teal outline-none transition-all"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
              />
            </FormField>

            <FormField label="Email">
              <input
                type="email"
                placeholder="EMAIL_ADDRESS"
                className="w-full bg-zinc-900 border-none p-4 text-white font-bold placeholder:text-zinc-700 focus:ring-2 focus:ring-heavy-teal outline-none transition-all"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </FormField>

            <FormField label="Password">
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-900 border-none p-4 text-white font-bold placeholder:text-zinc-700 focus:ring-2 focus:ring-heavy-teal outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormField>

            <FormField label="Confirm password">
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-900 border-none p-4 text-white font-bold placeholder:text-zinc-700 focus:ring-2 focus:ring-heavy-teal outline-none transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormField>
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <Button variant="auth" type="submit">
              Sign up
            </Button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors text-center"
            >
              Already have account?{" "}
              <span className="text-heavy-teal underline underline-offset-4">
                Log in
              </span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default SignupPage;
