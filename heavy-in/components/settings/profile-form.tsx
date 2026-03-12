"use client";

import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { profileSchema } from "@/app/lib/schemas";

const ProfileForm = () => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImg, setPendingImg] = useState<string | null>(null);
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
    if (user?.bio) {
      setBio(user.bio);
    }
  }, [user]);

  const handleProfileImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // 1. Převeď na base64 pro live preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingImg(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user || loading) return;

    const result = profileSchema.safeParse({ username, bio });

    if (!result.success) {
      // Vezmeme první chybu, která nastala
      const firstError = result.error.issues[0].message;
      setStatus({ type: "error", text: firstError });
      return;
    }

    const validatedData = result.data;

    setLoading(true);
    setStatus(null);

    try {
      // 1. KONTROLA UNIKÁTNOSTI (stále probíhá samostatně před batchem)
      if (validatedData.username !== user.username) {
        const q = query(
          collection(db, "users"),
          where("username", "==", validatedData.username),
        );
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
          setStatus({
            type: "error",
            text: "Toto uživatelské jméno je již obsazené.",
          });
          setLoading(false);
          return;
        }
      }

      // 2. INICIALIZACE BATCHE
      const batch = writeBatch(db);

      // 3. PŘÍPRAVA UPDATE PROFILU (vložíme do batche místo updateDoc)
      const userRef = doc(db, "users", user.uid);
      const userUpdateData = {
        username: validatedData.username,
        bio: validatedData.bio,
        ...(pendingImg && { avatarUrl: pendingImg }), // Elegantní přidání fotky, jen pokud existuje
      };

      batch.update(userRef, userUpdateData);

      // 4. PŘÍPRAVA UPDATE WORKOUTŮ
      const workoutsSnap = await getDocs(
        query(collection(db, "workouts"), where("userId", "==", user.uid)),
      );

      workoutsSnap.docs.forEach((w) => {
        batch.update(w.ref, {
          avatarUrl: pendingImg ?? user.avatarUrl,
          author: validatedData.username,
        });
      });

      // 5. ODESLÁNÍ VŠEHO NAJEDNOU
      await batch.commit();

      // Po úspěšném commitu osvěžíme data a vyčistíme stavy
      await refreshUser();
      setPendingImg(null);
      setStatus({ type: "success", text: "Profil úspěšně uložen!" });
    } catch (error) {
      setStatus({ type: "error", text: "Chyba při ukládání: " + error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-white">
        <CardTitle className="text-xl">Profil</CardTitle>
        <CardDescription>
          Tyto informace jsou veřejné pro ostatní uživatele.
        </CardDescription>
      </CardHeader>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleProfileImgChange}
      />
      <CardContent className="space-y-6 bg-white">
        {/* Avatar Upload */}
        <div className="flex flex-col gap-4 items-start">
          <Label>Profilová fotka</Label>
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar className="h-24 w-24 border-2 border-slate-100 shadow-sm">
              <AvatarImage src={pendingImg ?? user?.avatarUrl ?? "user.png"} />
              <AvatarFallback className="bg-slate-200">
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 p-2 bg-[#20b2aa] text-white rounded-full shadow-lg hover:bg-[#1a938c] transition-colors">
              <Camera size={16} />
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Uživatelské jméno</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={user?.username || "username"}
              className="rounded-lg border-slate-200 focus:ring-[#20b2aa]"
              maxLength={50}
            />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Napiš něco o sobě..."
              className="resize-none min-h-25 rounded-lg border-slate-200 focus:ring-[#20b2aa] overflow-hidden w-full wrap-break-word"
              maxLength={255}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex flex-col items-start">
        <Button
          className="bg-[#20b2aa] hover:bg-[#1a938c] text-white font-semibold rounded-lg"
          onClick={handleSaveProfile}
          disabled={loading}
        >
          {loading ? "Ukládám..." : "Uložit profil"}
        </Button>
        {status && (
          <p
            className={`mt-3 text-sm text-center font-medium ${
              status.type === "success" ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {status.text}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileForm;
