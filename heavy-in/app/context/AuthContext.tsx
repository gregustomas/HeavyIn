"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getIdToken, onIdTokenChanged, signOut } from "firebase/auth";
import { auth, db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";

interface CustomUser {
  uid: string;
  email: string | null;
  username: string | null;
  avatarUrl?: string;
  bio?: string;
}

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await signOut(auth);
  };

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setUser((prev) => ({
        ...prev!,
        avatarUrl: userData.avatarUrl,
        username: userData.username,
        bio: userData.bio,
      }));
    }
  };

  useEffect(() => {
    // onIdTokenChanged = onAuthStateChanged + hlídá refresh tokenu
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (firebaseUser) {
        // Získáme token a uložíme do cookie
        const token = await getIdToken(firebaseUser);
        document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Strict`;

        // Načteme data z Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        let userDoc = await getDoc(userDocRef);

        // Retry pokud doc ještě neexistuje (např. po Google signup)
        if (!userDoc.exists()) {
          await new Promise((res) => setTimeout(res, 1500));
          userDoc = await getDoc(userDocRef);
        }

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: userData.username || null,
            avatarUrl: userData.avatarUrl || null,
            bio: userData.bio || null,
          });
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: null,
          });
        }
      } else {
        // Odhlášení - smaž cookie
        document.cookie = "auth-token=; path=/; max-age=0";
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth musí být použit uvnitř AuthProvideru");
  }

  return context;
};
