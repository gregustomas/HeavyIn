import Link from "next/link";

import { formatDate } from "@/app/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserCardProps {
  author: string | undefined;
  avatarUrl: string | undefined;
  date: Date | string | undefined;
}

function UserCard({ author, avatarUrl, date }: UserCardProps) {
  return (
    <Link href={"/profile/" + author}>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl || "/user.png"} alt={author} />
          <AvatarFallback>
            {author?.charAt(0).toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#5c5a57]">{author}</span>
          <span className="text-xs text-[#8a8580]">{formatDate(date!)}</span>
        </div>
      </div>
    </Link>
  );
}

export default UserCard;
