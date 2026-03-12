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
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { FieldDescription } from "../ui/field";

const ProfileForm = () => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImg, setPendingImg] = useState<string | null>(null);
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
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
    if (!user) return;

    const userUpdateData: any = {
      username: username,
      bio: bio,
    };

    if (pendingImg) {
      userUpdateData.avatarUrl = pendingImg;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), userUpdateData);

      const workoutsSnap = await getDocs(
        query(collection(db, "workouts"), where("userId", "==", user.uid)),
      );

      const batch = writeBatch(db);
      workoutsSnap.docs.forEach((w) => {
        batch.update(w.ref, {
          avatarUrl: pendingImg ?? user.avatarUrl,
          author: username,
        });
      });
      await batch.commit();
      await refreshUser();

      setPendingImg(null);
      setStatus({
        type: "success",
        text: "Profil úspěšně uložen!",
      });
    } catch (error) {
      setStatus({
        type: "error",
        text: "Chyba při ukládání:" + error,
      });
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

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Napiš něco o sobě..."
              className="resize-none min-h-25 rounded-lg border-slate-200 focus:ring-[#20b2aa] overflow-hidden w-full break-all"
              maxLength={255}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 grid justify-start">
        <Button
          className="bg-[#20b2aa] hover:bg-[#1a938c] text-white font-semibold rounded-lg"
          onClick={handleSaveProfile}
        >
          Uložit profil
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
