export const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid gap-2">
    <label className="label-heavy">{label}</label>
    {children}
  </div>
);