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
} from "../ui/alert-dialog";

const AccountForm = () => {
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
              type="password"
              className="rounded-lg border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nové heslo</Label>
            <Input
              id="new-password"
              type="password"
              className="rounded-lg border-slate-200"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
        <Button variant="outline" className="w-full sm:w-auto rounded-lg">
          Aktualizovat heslo
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full sm:w-auto"
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
      </CardFooter>
    </Card>
  );
};

export default AccountForm;
