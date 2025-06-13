const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

if (!API_URL) throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}