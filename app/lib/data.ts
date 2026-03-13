export const USERS = [
  {
    id: "u1",
    username: "tom_swole_",
    email: "tom@heavyin.com",
    workoutsCreated: 15,
    avatarUrl: "",
  },
];

export const DUMMY_WORKOUTS = [
  {
    id: "w1",
    userId: "u1",
    title: "Upper/Lower: A",
    image: "/cbum.avif",
    description:
      "Upper body trénink zaměřený na triceps, záda a prsa. ",
    split: "Full Body",
    exercises: [
      {
        exercise: "Bench",
        sets: 2,
        note: "Focus on contraction",
      },
    ],
    time: 90,
    stats: { likes: 123, commentsCount: 12, shares: 3 },
    interactions: {
      liked: false,
      saved: false,
      shared: false,
      comments: [
        { id: "c1", username: "gym_rat", text: "Brutální forma! 🔥" },
        { id: "c2", username: "fitness_girl", text: "Ten split vypadá super." },
      ],
    },
  },
  
];