import ProfileForm from "@/components/settings/profile-form";
import AccountForm from "@/components/settings/account-form";

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

        <p className="text-center text-xs text-slate-400">
          HeavyIn v1.0.2 • Made for athletes
        </p>
      </div>
    </div>
  );
}
