import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("neplatný email"),
  password: z.string().min(6, "Heslo musí mít alespoň 6 znaků"),
});

export const signupSchema = z
  .object({
    username: z.string().min(3, "Username musí mít alespoň 3 znaky").max(20),
    email: z.string().email("Neplatný email"),
    password: z.string().min(6, "Heslo musí mít alespoň 6 znaků"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hesla se neshodují",
    path: ["confirmPassword"],
  });

export const workoutSchema = z.object({
  title: z.string().min(1, "Název je povinný").max(50),
  description: z.string().max(200).optional(),
  split: z.string(),
  exercises: z
    .array(
      z.object({
        name: z.string().min(1, "Název cviku je povinný"),
        sets: z.string(),
        reps: z.string(),
      }),
    )
    .min(1, "Přidej alespoň jeden cvik"),
});

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Jméno musí mít alespoň 3 znaky")
    .max(20, "Jméno může mít maximálně 20 znaků")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Jméno může obsahovat pouze písmena, čísla a podtržítka",
    )
    .trim()
    .toLowerCase(),
  bio: z
    .string()
    .max(255, "Bio může mít maximálně 255 znaků")
    .optional()
    .or(z.literal("")),
});

export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type WorkoutData = z.infer<typeof workoutSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
