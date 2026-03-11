"use client";

import { Share2 } from "lucide-react";

interface ShareBtnProps {
  title: string | undefined;
  id: string | undefined;
}

const ShareBtn = ({ title, id }: ShareBtnProps) => {
  return (
    <button
      onClick={() =>
        navigator.share({
          title,
          url: `${window.location.origin}/workout/${id}`,
        })
      }
      className="text-[#4a9e9e] cursor-pointer hover:text-[#3d8585] transition-colors"
    >
      <Share2 className="h-5 w-5" />
    </button>
  );
};

export default ShareBtn;
