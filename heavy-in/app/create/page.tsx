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
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
      await addDoc(collection(db, "workouts"), {
        userId: user.uid,
        authorName: user.displayName || user.email?.split("@")[0],
        title: workoutData.title,
        description: workoutData.description,
        split: workoutData.split,
        image: workoutData.image,
        exercises: exerciseList,
        likes: [],
        likeCount: 0,
        createdAt: serverTimestamp(),
      });

      router.push("/");
    } catch (err) {
      console.error("Chyba při ukládání do Firestore:", err);
    }
  };

  return (
    <main className="grid gap-8">
      <div className="flex gap-2 items-center text-2xl font-black uppercase italic tracking-tighter leading-[0.85]">
        <BackBtn link="/" />
        Create <span className="text-heavy-teal">workout</span>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <FormField label="Cover image">
          <ImageUpload
            image={workoutData.image}
            setImage={(img) => handleInputChange("image", img)}
          />
        </FormField>

        <FormField label="Title *">
          <input
            required
            type="text"
            placeholder="My workout"
            className="input-heavy"
            value={workoutData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
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

        <hr className="text-heavy-coral" />

        <div className="grid gap-6">
          <div className="flex items-center justify-between py-3">
            <h3 className="label-heavy text-2xl text-white">Exercises</h3>

            <Button variant="add" icon={Plus} onClick={addExercise}>
              Add exercise
            </Button>
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

        <Button type="submit">Publish Workout</Button>
      </form>
    </main>
  );
}

export default CreateWorkoutPage;
