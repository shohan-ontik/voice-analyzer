import "server-only";
import { API_BASE_URL } from "./apiClient";
import { getSessionToken } from "./session";

// Shared by the video/pdf material streaming routes: the browser's <video>
// element or a PDF <iframe> can't attach an Authorization header itself, so
// this reads the session cookie server-side, forwards it as a Bearer token,
// and streams the backend's response body straight through (Range included
// both ways) without buffering it.
export async function proxyMaterialStream(request: Request, materialId: string, kind: "video" | "pdf") {
  const token = await getSessionToken();
  if (!token) {
    return new Response(null, { status: 401 });
  }

  const range = request.headers.get("range");

  const upstream = await fetch(`${API_BASE_URL}/media/materials/${encodeURIComponent(materialId)}/${kind}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(range ? { Range: range } : {}),
    },
    cache: "no-store",
  });

  const headers = new Headers();
  for (const key of ["content-type", "content-length", "content-range", "accept-ranges"]) {
    const value = upstream.headers.get(key);
    if (value) headers.set(key, value);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
