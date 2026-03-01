"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";

interface CustomUser {
  uid: string;
  email: string | null;
  username: string | null;
  avatarUrl?: string;
}

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (firebaseUser) {
        // 1. Uživatel je v Auth, jdeme pro jeho data do Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          // 2. Složíme dohromady Auth a Firestore data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: userData.username || null,
            avatarUrl: userData.avatarUrl || null,
          });
        } else {
          // Uživatel existuje v Auth, ale nemá dokument v DB (např. po registraci)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: null,
          });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
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
