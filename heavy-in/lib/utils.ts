import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: any): string {
  // Firestore Timestamp má metodu .toDate()
  const d = date?.toDate?.() ?? new Date(date);
  return d
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
    .replace(/\//g, ". ");
}
