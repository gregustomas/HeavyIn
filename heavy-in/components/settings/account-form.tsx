"use client";

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
import { Button } from "../ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import { auth } from "@/app/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { toast } from "sonner";

const AccountForm = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const isGoogleUser = auth.currentUser?.providerData.some(
    (p) => p.providerId === "google.com",
  );

  if (isGoogleUser) {
    // skryj sekci změny hesla úplně
    return null;
  }

  const handlePasswordUpdate = async () => {
    if (!auth.currentUser || !user?.email) return;

    try {
      // ověření starého hesla
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // nastavení nového
      await updatePassword(auth.currentUser, newPassword);
      toast.success("Heslo bylo úspěšně změněno.", { position: "top-center" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      if (err.code === "auth/wrong-password")
        toast.error("Špatné aktuální heslo.", { position: "top-center" });
      else if (err.code === "auth/weak-password")
        toast.error("Nové heslo musí mít alespoň 6 znaků.", {
          position: "top-center",
        });
      else toast.error("Chyba při změně hesla.", { position: "top-center" });
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">Zabezpečení</CardTitle>
        <CardDescription>Změna hesla a správa přístupu.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="current-password">Aktuální heslo</Label>
            <Input
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              className="rounded-lg border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nové heslo</Label>
            <Input
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              className="rounded-lg border-slate-200"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
        <Button
          variant="outline"
          className="w-full sm:w-auto rounded-lg"
          onClick={handlePasswordUpdate}
        >
          Aktualizovat heslo
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountForm;
