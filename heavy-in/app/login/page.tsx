"use client";

import Button from "@/components/Button";
import { FormField } from "@/components/FormField";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (user) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError("Špatný e-mail nebo heslo.");
      console.error(err.message);
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
            Strength & Discipline / Authentication
          </p>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
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
                type="email"
                placeholder="EMAIL_ADDRESS"
                className="w-full bg-zinc-900 border-none p-4 text-white font-bold placeholder:text-zinc-700 focus:ring-2 focus:ring-heavy-teal outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <Button variant="auth" type="submit">
              Authorize
            </Button>

            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors text-center"
            >
              No account?{" "}
              <span className="text-heavy-teal underline underline-offset-4">
                Join the ranks
              </span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
