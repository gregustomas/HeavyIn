import ProfileForm from "@/components/settings/profile-form";
import AccountForm from "@/components/settings/account-form";
import { DeleteAccountBtn } from "@/components/settings/delete-account-btn";

export default function SettingsPage() {
  return (
    <main className="page-container space-y-6 mb-10">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your profile and account.
        </p>
      </div>
      <ProfileForm />
      <AccountForm />
      <DeleteAccountBtn />
      <p className="text-center text-xs text-muted-foreground">
        HeavyIn v1.0 • Made for athletes
      </p>
    </main>
  );
}
