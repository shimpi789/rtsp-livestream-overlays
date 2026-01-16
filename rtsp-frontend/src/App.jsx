import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Rnd } from "react-rnd";
import {
  fetchOverlays,
  createOverlay,
  updateOverlay,
  deleteOverlay,
} from "./api";

export default function App() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const [overlays, setOverlays] = useState([]);
  const [streamUrl, setStreamUrl] = useState(
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  );

  /* ---------------- VIDEO ---------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    if (Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy();
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    }
  }, [streamUrl]);

  /* ---------------- FETCH OVERLAYS ---------------- */
  useEffect(() => {
    fetchOverlays().then((data) => {
      setOverlays(
        data.map((o) => ({
          ...o,
          x: Number(o.x),
          y: Number(o.y),
          width: Number(o.width),
          height: Number(o.height),
        }))
      );
    });
  }, []);

  /* ---------------- ADD TEXT OVERLAY ---------------- */
  const addTextOverlay = async () => {
    const text = prompt("Enter text", "LIVE");
    if (!text) return;

    const overlay = await createOverlay({
      type: "text",
      content: text,
      x: 20,
      y: 20,
      width: 140,
      height: 40,
    });

    setOverlays((prev) => [...prev, overlay]);
  };

  /* ---------------- ADD IMAGE OVERLAY ---------------- */
  const addImageOverlay = async () => {
    const imageUrl = prompt("Enter image/logo URL");
    if (!imageUrl) return;

    const overlay = await createOverlay({
      type: "image",
      content: imageUrl,
      x: 40,
      y: 40,
      width: 120,
      height: 120,
    });

    setOverlays((prev) => [...prev, overlay]);
  };

  /* ---------------- DELETE OVERLAY ---------------- */
  const removeOverlay = async (id) => {
    await deleteOverlay(id);
    setOverlays((prev) => prev.filter((o) => o._id !== id));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        padding: "32px",
        color: "#fff",
        fontFamily: "system-ui",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ marginBottom: 12 }}>Livestream Overlay Demo</h1>

        {/* STREAM URL INPUT */}
        <input
          type="text"
          value={streamUrl}
          onChange={(e) => setStreamUrl(e.target.value)}
          placeholder="Paste RTSP-converted HLS stream URL"
          style={{
            width: "100%",
            maxWidth: 600,
            padding: "10px",
            marginBottom: 12,
            borderRadius: 6,
            border: "1px solid #444",
            background: "#000",
            color: "#fff",
          }}
        />

        <div style={{ marginTop: 10 }}>
          <button
            onClick={addTextOverlay}
            style={{
              padding: "10px 16px",
              marginRight: 10,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Add Text Overlay
          </button>

          <button
            onClick={addImageOverlay}
            style={{
              padding: "10px 16px",
              background: "#059669",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Add Image Overlay
          </button>
        </div>
      </div>

      {/* VIDEO CONTAINER */}
      <div
        style={{
          position: "relative",
          width: "100%",
          background: "#000",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          controls
          style={{ width: "100%", display: "block" }}
        />

        {/* OVERLAYS */}
        {overlays.map((overlay) => (
          <Rnd
            key={overlay._id}
            bounds="parent"
            size={{ width: overlay.width, height: overlay.height }}
            position={{ x: overlay.x, y: overlay.y }}
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
            onDragStop={(e, d) => {
              updateOverlay(overlay._id, { x: d.x, y: d.y });
              setOverlays((prev) =>
                prev.map((o) =>
                  o._id === overlay._id ? { ...o, x: d.x, y: d.y } : o
                )
              );
            }}
            onResizeStop={(e, dir, ref, delta, pos) => {
              const updated = {
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                x: pos.x,
                y: pos.y,
              };
              updateOverlay(overlay._id, updated);
              setOverlays((prev) =>
                prev.map((o) =>
                  o._id === overlay._id ? { ...o, ...updated } : o
                )
              );
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                cursor: "move",
                userSelect: "none",
              }}
            >
              {/* TEXT OVERLAY */}
              {overlay.type === "text" && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#d32f2f",
                    color: "#fff",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {overlay.content}
                </div>
              )}

              {/* IMAGE OVERLAY */}
              {overlay.type === "image" && (
                <img
                src={overlay.content}
                alt="overlay"
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: 6,
                  pointerEvents: "none",   // IMPORTANT FIX
                }}
              />
              
              )}

              {/* DELETE */}
              <button
  onClick={(e) => {
    e.stopPropagation();
    deleteOverlay(overlay._id);
    setOverlays((prev) => prev.filter((o) => o._id !== overlay._id));
  }}
  style={{
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: "50%",
    border: "none",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",

    /*  IMPORTANT PART */
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1,

    cursor: "pointer",
  }}
  title="Remove overlay"
>
  ×
</button>

            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
}
