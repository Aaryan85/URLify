const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";

export async function createShortUrl(url) {
  const res = await fetch(`${API_BASE}/url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create short URL");
  }
  return data;
}

export async function getAllUrls() {
  const res = await fetch(`${API_BASE}/url/all`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch URLs");
  }
  return data;
}

export async function getUrlAnalytics(shortId) {
  const res = await fetch(`${API_BASE}/url/${shortId}/analytics`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch analytics");
  }
  return data;
}

export async function deleteUrl(shortId) {
  const res = await fetch(`${API_BASE}/url/${shortId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to delete URL");
  }
  return data;
}

export function getShortUrlHref(shortId) {
  return `${API_BASE}/url/${shortId}`;
}
