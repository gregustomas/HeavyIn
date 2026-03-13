import ProfileForm from "@/components/settings/profile-form";
import AccountForm from "@/components/settings/account-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pb-10">
      <div className="max-w-2xl mx-auto p-4 pt-8 md:pt-12 space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Nastavení
          </h1>
          <p className="text-slate-500">
            Spravuj svůj profil a zabezpečení účtu.
          </p>
        </div>

        <ProfileForm />
        <AccountForm />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="hover:bg-red-500 w-full sm:w-auto"
            >
              Smazat účet
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Opravdu chceš skončit?</AlertDialogTitle>
              <AlertDialogDescription>
                Tato akce trvale smaže tvůj účet a všechny tvoje tréninky (7
                workoutů). Tohle nejde vzít zpět.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg">
                Zrušit
              </AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white rounded-lg border-none">
                Smazat navždy
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <p className="text-center text-xs text-slate-400">
          HeavyIn v1.0.2 • Made for athletes
        </p>
      </div>
    </div>
  );
}
