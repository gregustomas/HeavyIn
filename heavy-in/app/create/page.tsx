"use client";

import BackBtn from "@/components/BackBtn";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import ExerciseItem, { ExerciseData } from "@/components/ExerciseItem";
import { FormField } from "@/components/FormField";
import ImageUpload from "@/components/ImageUpload";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const SPLIT = ["Bro split", "Fullbody", "Upper/Lower", "Custom"];

function CreateWorkoutPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [workoutData, setWorkoutData] = useState({
    title: "",
    description: "",
    split: SPLIT[SPLIT.length - 1],
    image: null as string | null,
  });
  const [exerciseList, setExerciseList] = useState([
    { id: crypto.randomUUID(), name: "", sets: "", reps: "", note: "" },
  ]);
  const [isPublishing, setIsPublishing] = useState(false);
  const handleInputChange = (field: string, value: string | null) => {
    setWorkoutData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addExercise = () => {
    setExerciseList([
      ...exerciseList,
      { id: crypto.randomUUID(), name: "", sets: "", reps: "", note: "" },
    ]);
  };

  const removeExercise = (id: string) =>
    setExerciseList((prev) => prev.filter((ex) => ex.id !== id));

  const updateExercise = (index: number, updatedData: ExerciseData) => {
    setExerciseList((prev) =>
      prev.map((item, i) => (i === index ? updatedData : item)),
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Workout info:", workoutData);
    console.log("Workout list:", exerciseList);

    handleSaveWorkout(workoutData);
  };

  const handleSaveWorkout = async (workoutData: any) => {
    if (!user) {
      alert("Pro uložení tréninku se musíš přihlásit.");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const realUsername = userDoc.exists()
        ? userDoc.data().username
        : user.email?.split("@")[0];

      await addDoc(collection(db, "workouts"), {
        userId: user.uid,
        author: realUsername,
        title: workoutData.title,
        description: workoutData.description,
        split: workoutData.split,
        image: workoutData.image,
        exercises: exerciseList,
        createdAt: serverTimestamp(),
      });

      router.push("/");
    } catch (err) {
      console.error("Chyba při ukládání do Firestore:", err);
    }
  };

  return (
    <main className="min-h-screen pb-4">
      <div className="sticky mb-4 top-0 z-50 bg-white/90 backdrop-blur-sm p-4 flex items-center justify-between border-b border-heavy-border/50">
        <div className="flex flex-col tracking-tighter">
          <span className="text-xl font-black uppercase">Create</span>
          <span className="text-xl font-black uppercase text-heavy-teal">
            Workout
          </span>
        </div>

        <div className="flex items-center gap-2">
          <BackBtn link="/" />

          <button
            form="workout-form"
            type="submit"
            disabled={isPublishing}
            className="bg-heavy-teal text-white h-10 px-6 rounded-xl font-black uppercase italic tracking-tighter text-sm shadow-md active:scale-95 transition-all"
          >
            {isPublishing ? "..." : "Publish"}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        id="workout-form"
        className="grid gap-6 p-4"
      >
        <FormField label="Title *">
          <input
            required
            type="text"
            placeholder="My workout"
            className="input-heavy"
            value={workoutData.title}
            onChange={(e) =>
              handleInputChange("title", e.target.value.toLowerCase())
            }
          />
        </FormField>

        <FormField label="Description">
          <textarea
            placeholder="Power based training"
            className="textarea-heavy"
            value={workoutData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </FormField>

        <Dropdown
          label="Training split"
          options={SPLIT}
          selected={workoutData.split}
          onSelect={(option) => handleInputChange("split", option)}
        />

        <FormField label="Cover image">
          <ImageUpload
            image={workoutData.image}
            setImage={(img) => handleInputChange("image", img)}
          />
        </FormField>

        <div className="grid gap-6">
          <div className="flex items-center justify-between py-3">
            <h3 className="label-heavy text-2xl text-heavy-main">Exercises</h3>
          </div>

          {exerciseList.map((item, index) => (
            <ExerciseItem
              key={item.id}
              index={index}
              data={item}
              onUpdate={updateExercise}
              onRemove={() => removeExercise(item.id)}
              isRemovable={exerciseList.length > 1}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="addExercise"
          icon={Plus}
          onClick={addExercise}
        >
          Add exercise
        </Button>
      </form>
    </main>
  );
}

export default CreateWorkoutPage;
