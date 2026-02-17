import { ArrowLeft } from "lucide-react"
import Link from "next/link";

interface BackBtnProps {
    link: string;
}

function BackBtn({link}: BackBtnProps) {
  return (
    <div className="absolute top-6 left-6 z-50">
            <Link
              href={link || "/"}
              className="flex items-center gap-2 bg-heavy-surface/40 backdrop-blur-xl px-4 py-2 rounded-full border border-heavy-border hover:bg-heavy-surface/60 transition-all shadow-2xl group"
            >
              <ArrowLeft
                size={18}
                className="text-heavy-teal group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-heavy-main">
                Back
              </span>
            </Link>
          </div>
  )
}

export default BackBtn