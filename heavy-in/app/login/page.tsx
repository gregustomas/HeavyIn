"use client";

import Button from "@/components/Button";
import { FormField } from "@/components/FormField";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/loginForm";

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

  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch {
      setError("Špatný e-mail nebo heslo.");
    }
  };

  return (
    <main className="md:p-8 pb-30 max-w-7xl mx-auto p-4">
      <LoginForm onSubmit={handleLogin} />
    </main>
  );
}

export default LoginPage;
