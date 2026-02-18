import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "publish" | "add";
  icon?: LucideIcon;
  children: React.ReactNode;
}

const Button = ({
  variant = "publish",
  icon: Icon,
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const styles = {
    publish:
      "w-full mt-5 cursor-pointer py-5 bg-heavy-teal text-black font-black uppercase italic rounded-2xl text-xl shadow-2xl shadow-heavy-teal/20 hover:brightness-110 hover:-translate-y-1 active:scale-95 transition-all duration-200",
    add: "flex gap-2 items-center px-5 py-1.5 bg-heavy-teal hover:bg-heavy-teal/90 text-white text-xs font-black uppercase tracking-tight rounded-lg transition-all active:scale-95 shadow-sm shrink-0",
  };

  return (
    <button className={`${styles[variant]} ${className}`} {...props}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default Button;
