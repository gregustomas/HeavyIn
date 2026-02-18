import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackBtnProps {
  link: string;
}

function BackBtn({ link }: BackBtnProps) {
  return (
    <Link
      href={link || "/"}
      className="flex items-center justify-center w-10 h-10 bg-heavy-surface/40 backdrop-blur-xl rounded-xl border border-heavy-border hover:bg-heavy-surface/60 transition-all shadow-xl group active:scale-95"
    >
      <ArrowLeft
        size={18}
        className="text-heavy-teal group-hover:-translate-x-1 transition-transform"
      />
    </Link>
  );
}

export default BackBtn;
