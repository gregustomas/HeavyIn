import { Plus, Trash2 } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export interface ExerciseData {
  id: string;
  name: string;
  sets: string;
  reps: string;
  note: string;
  showNote: boolean;
}

interface ExerciseItemProps {
  index: number;
  data: ExerciseData;
  onUpdate: (id: string, field: string, value: string | boolean) => void;
  onRemove: (id: string) => void;
}

export default function ExerciseItem({
  index,
  data,
  onUpdate,
  onRemove,
}: ExerciseItemProps) {
  const { id, name, sets, reps, note, showNote } = data;

  return (
    <div className="rounded-lg border border-[#e0e0e0] bg-background p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00b894] text-xs font-bold text-white">
            {index + 1}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-[#5c5a57]">
            Exercise Details
          </span>
        </div>
        <button
          onClick={() => onRemove(id)}
          className="text-[#8a8580] transition-colors hover:text-[#e07850]"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Name */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold uppercase tracking-wide text-[#5c5a57]">
            Name
          </Label>
          <Input
            placeholder="e.g. Bench Press"
            value={name}
            onChange={(e) => onUpdate(id, "name", e.target.value)}
            className="rounded-lg border-[#e0e0e0] bg-background"
          />
        </div>

        {/* Sets & Reps */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <Label className="text-xs font-semibold uppercase tracking-wide text-[#5c5a57]">
              Sets
            </Label>
            <Input
              placeholder="0"
              value={sets}
              onChange={(e) => onUpdate(id, "sets", e.target.value)}
              className="rounded-lg border-[#e0e0e0] bg-background"
              maxLength={1}
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-xs font-semibold uppercase tracking-wide text-[#5c5a57]">
              Reps
            </Label>
            <Input
              placeholder="6-8"
              value={reps}
              onChange={(e) => onUpdate(id, "reps", e.target.value)}
              className="rounded-lg border-[#e0e0e0] bg-background"
              maxLength={5}
            />
          </div>
        </div>

        {/* Note */}
        {showNote ? (
          <div className="space-y-1">
            <Label className="text-xs font-semibold uppercase tracking-wide text-[#5c5a57]">
              Note
            </Label>
            <Textarea
              placeholder="Add a note..."
              value={note}
              onChange={(e) => onUpdate(id, "note", e.target.value)}
              className="min-h-15 rounded-lg border-[#e0e0e0] bg-background"
            />
          </div>
        ) : (
          <button
            onClick={() => onUpdate(id, "showNote", true)}
            className="flex items-center gap-1 text-sm font-medium text-[#00b894] hover:text-[#00a383]"
          >
            <Plus className="h-4 w-4" />
            Add note
          </button>
        )}
      </div>
    </div>
  );
}
