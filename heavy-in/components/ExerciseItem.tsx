"use client";

import { Trash2 } from "lucide-react";

export interface ExerciseData {
  id: string;
  name: string;
  sets: string;
  reps: string;
  note: string;
}

interface ExerciseItemProps {
  data: ExerciseData;
  index: number;
  onUpdate: (index: number, updatedData: ExerciseData) => void;
  onRemove: (index: string) => void;
  isRemovable: boolean;
}

export default function ExerciseItem({
  index,
  onRemove,
  isRemovable,
  data,
  onUpdate,
}: ExerciseItemProps) {
  const handleChange = (field: keyof ExerciseData, value: string) => {
    onUpdate(index, { ...data, [field]: value });
  };

  return (
    <div className="w-full border-heavy-border border-2 rounded-2xl p-5 bg-heavy-card relative group transition-all hover:border-heavy-teal/30">
      {/* Header cviku */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-heavy-teal/20 flex items-center justify-center text-heavy-teal font-black text-sm italic">
            {index + 1}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-heavy-muted">
            Exercise details
          </span>
        </div>

        {isRemovable && (
          <button
            type="button"
            onClick={() => onRemove(data.id)}
            className="p-2 hover:bg-heavy-coral/10 rounded-lg transition-colors group/trash"
          >
            <Trash2
              size={20}
              className="text-heavy-muted group-hover/trash:text-heavy-coral"
            />
          </button>
        )}
      </div>

      {/* Inputy */}
      <div className="grid gap-5">
        <div>
          <label className="label-heavy">Name</label>
          <input
            type="text"
            className="input-heavy p-3"
            placeholder="e.g. Bench Press"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-heavy">Sets</label>
            <input
              type="number"
              placeholder="0"
              className="input-heavy p-3"
              value={data.sets}
              onChange={(e) => handleChange("sets", e.target.value)}
            />
          </div>

          <div>
            <label className="label-heavy">Reps</label>
            <input
              type="text"
              placeholder="6-8"
              className="input-heavy p-3"
              value={data.reps}
              onChange={(e) => handleChange("reps", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label-heavy">Note</label>
          <textarea
            className="textarea-heavy p-3 min-h-20"
            placeholder="Focus on eccentric phase..."
            value={data.note}
            onChange={(e) => handleChange("note", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
