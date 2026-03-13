"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, signInWithGoogle } from "../firebase";
import { LoginForm } from "@/components/loginForm";
import { GalleryVerticalEnd } from "lucide-react";
import { loginSchema } from "../lib/schemas";
import { useRouter } from "next/navigation";
import { handleGoogleAuth } from "@/lib/utils";

function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();
      document.cookie = `auth-token=${token}; path=/; max-age=3600`;
      router.push("/");
    } catch {
      setError("Špatný e-mail nebo heslo.");
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-4 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          HeavyIn
        </a>
        <LoginForm
          onSubmit={handleLogin}
          onGoogleLogin={() => handleGoogleAuth(router)}
          error={error}
        />
      </div>
    </div>
  );
}

export default LoginPage;
