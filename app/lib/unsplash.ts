export async function getUnsplashImage(query = "gym workout"): Promise<string> {
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
    );
    const data = await res.json();
    return data.urls?.small ?? "/cbum.avif";
  } catch {
    return "/cbum.avif";
  }
}
