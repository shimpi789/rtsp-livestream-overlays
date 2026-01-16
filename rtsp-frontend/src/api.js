const API_BASE = "http://127.0.0.1:5000/api";

export async function fetchOverlays() {
  const res = await fetch(`${API_BASE}/overlays`);
  return res.json();
}

export async function createOverlay(data) {
  const res = await fetch(`${API_BASE}/overlays`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateOverlay(id, data) {
  await fetch(`${API_BASE}/overlays/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteOverlay(id) {
  await fetch(`${API_BASE}/overlays/${id}`, {
    method: "DELETE",
  });
}
