import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth, db, signInWithGoogle } from "@/app/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: any): string {
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

export const handleGoogleAuth = async (
  router: ReturnType<typeof import("next/navigation").useRouter>,
) => {
  const user = await signInWithGoogle();
  const userSnap = await getDoc(doc(db, "users", user.uid));

  if (!userSnap.exists()) {
    const baseUsername =
      user.displayName?.replace(/\s+/g, "").toLowerCase() || "user";
    const username = `${baseUsername}${Math.floor(Math.random() * 9000) + 1000}`;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      username,
      bio: "",
      avatarUrl: user.photoURL || "/user.png",
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "usernames", username), { uid: user.uid });
  }

  const token = await user.getIdToken();
  document.cookie = `auth-token=${token}; path=/; max-age=3600`;
  router.push("/");
};
