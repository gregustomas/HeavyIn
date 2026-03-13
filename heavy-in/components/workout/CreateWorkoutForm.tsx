"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { workoutSchema } from "@/app/lib/schemas";
import ExerciseItem from "../ExerciseItem";
import ImageUpload from "../shared/ImageUpload";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  note: string;
  showNote: boolean;
}

interface CreateWorkoutFormProps {
  onBack?: () => void;
  onPublish?: (data: {
    title: string;
    description: string;
    split: string;
    coverImage: string | null;
    exercises: Exercise[];
  }) => void;
}

export function CreateWorkoutForm({ onPublish }: CreateWorkoutFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [split, setSplit] = useState("custom");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      sets: "",
      reps: "",
      note: "",
      showNote: false,
    },
  ]);

  const handlePublish = () => {
    const result = workoutSchema.safeParse({
      title,
      description,
      split,
      exercises,
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message, { position: "top-center" });
      return;
    }

    onPublish?.({
      title,
      description,
      split,
      coverImage,
      exercises,
    });
  };

  const addExercise = () => {
    const newId = crypto.randomUUID();
    setExercises([
      ...exercises,
      { id: newId, name: "", sets: "", reps: "", note: "", showNote: false },
    ]);
  };

  const updateExercise = (
    id: string,
    field: string,
    value: string | boolean,
  ) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)),
    );
  };

  const removeExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((ex) => ex.id !== id));
    }
  };

  return (
    <main>
      <div className="sticky top-0 z-50 bg-background border-b px-4 py-3 h-14">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heavy-teal text-3xl font-black tracking-tighter uppercase">
              CREATE
            </h1>
          </div>
          <Button
            variant="outline"
            className="rounded-full px-6 border-heavy-teal hover:text-heavy-teal bg-heavy-teal text-white transition-colors"
            onClick={handlePublish}
          >
            Publish
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4 p-4 py-5">
        {/* Title */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wide text-[#5c5a57]">
            Title <span className="text-[#00b894]">*</span>
          </Label>
          <Input
            placeholder="My workout"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border-[#e0e0e0] bg-background"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wide text-[#5c5a57]">
            Description
          </Label>
          <Textarea
            placeholder="Power based training"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-20 rounded-lg border-[#00b894] bg-background"
          />
        </div>

        {/* Training Split */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wide text-[#5c5a57]">
            Training Split
          </Label>
          <Select value={split} onValueChange={setSplit}>
            <SelectTrigger className="w-full rounded-lg border-[#e0e0e0] bg-background">
              <SelectValue placeholder="Select split" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom</SelectItem>
              <SelectItem value="fullbody">Fullbody</SelectItem>
              <SelectItem value="upper">Upper</SelectItem>
              <SelectItem value="lower">Lower</SelectItem>
              <SelectItem value="push">Push</SelectItem>
              <SelectItem value="pull">Pull</SelectItem>
              <SelectItem value="legs">Legs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cover Image */}
        <ImageUpload image={coverImage} setImage={setCoverImage} />

        {/* Exercises */}
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <ExerciseItem
              key={index}
              index={index}
              data={exercise}
              onUpdate={updateExercise}
              onRemove={removeExercise}
            />
          ))}

          {/* Add Exercise Button */}
          <Button
            variant="outline"
            className="w-full rounded-lg border-dashed border-[#e0e0e0] text-[#5c5a57] hover:border-[#00b894] hover:text-[#00b894]"
            onClick={addExercise}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add exercise
          </Button>
        </div>
      </div>
    </main>
  );
}
