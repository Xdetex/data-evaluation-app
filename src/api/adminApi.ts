// src/api/adminApi.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const fetchParticipants = (page: number, pageSize: number, sortByStatus: boolean) =>
  fetch(`${API_BASE_URL}/admin/participants?page=${page}&page_size=${pageSize}&sort_by_status=${sortByStatus}`)
    .then(r => r.json());

export async function fetchUserFiles(email: string) {
  const res = await fetch(`${API_BASE_URL}/admin/files/${encodeURIComponent(email)}`);
  if (!res.ok) {
    if (res.status === 404) return { email, uploaded_files: [] };
    throw new Error("Failed to fetch user files");
  }
  return res.json();
}

export async function deleteUserFile(email: string, filename: string) {
  const res = await fetch(
    `${API_BASE_URL}/admin/files/${encodeURIComponent(email)}/${encodeURIComponent(filename)}`,
    { method: "DELETE" }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete file");
  }
  return res.json();
}

export const deleteUserAllFiles = (email: string) =>
  fetch(`${API_BASE_URL}/admin/files/${email}`, { method: "DELETE" }).then(r => r.json());


export async function downloadAllFiles() {
  const res = await fetch(`${API_BASE_URL}/admin/download/all-files`);
  if (!res.ok) {
    throw new Error("Failed to create ZIP");
  }
  const blob = await res.blob();
  return blob;
}

export const sendRound = (round: 1 | 2 | "all") =>
  fetch(`${API_BASE_URL}/email/${round === "all" ? "send-all" : `send-round-${round}`}`, { method: "POST" })
    .then(r => r.json());
