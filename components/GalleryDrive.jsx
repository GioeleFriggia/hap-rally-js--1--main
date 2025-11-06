"use client";
/**
 * Gallery Google Drive (tua versione + frecce)
 * - Griglia responsive
 * - Fix HEIC (usa thumbnail come full)
 * - Anteprima GRANDE in hover (overlay) senza click
 * - Frecce per scorrere tra le immagini dello stesso album
 * - Supporto tastiera: ← → Esc
 */

import { useEffect, useMemo, useState } from "react";
// import "./GalleryDrive.css";

const API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
const ROOT_ID = process.env.NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID;

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";

/** URL immagine FULL */
const fileIdToFullSrc = (id) =>
  `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
    id
  )}?alt=media&key=${encodeURIComponent(API_KEY)}`;

async function gdriveList(params) {
  const u = new URL(DRIVE_API);
  Object.entries({
    key: API_KEY,
    spaces: "drive",
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
    pageSize: 1000,
    fields: "files(id,name,mimeType,parents,thumbnailLink)",
    ...params,
  }).forEach(([k, v]) => u.searchParams.set(k, v));

  const res = await fetch(u.toString());
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Drive API error (${res.status}): ${txt}`);
  }
  return res.json();
}

async function listAlbums(rootId) {
  const q = [
    `'${rootId}' in parents`,
    "mimeType = 'application/vnd.google-apps.folder'",
    "trashed = false",
  ].join(" and ");
  const data = await gdriveList({ q });
  return (data.files || []).sort((a, b) =>
    a.name.localeCompare(b.name, "it", { numeric: true })
  );
}

function mapFiles(data) {
  return (data.files || []).map((f) => {
    const isProblematic =
      /heic|heif|tiff|raw|dng/i.test(f.mimeType || "") ||
      /\.heic$/i.test(f.name || "");

    const bigThumb = f.thumbnailLink
      ? f.thumbnailLink.replace(/=s\d+(-c)?$/, "=s1500")
      : fileIdToFullSrc(f.id);

    return {
      id: f.id,
      name: f.name,
      thumbSrc: f.thumbnailLink
        ? f.thumbnailLink.replace(/=s\d+(-c)?$/, "=s600")
        : fileIdToFullSrc(f.id),
      fullSrc: isProblematic ? bigThumb : fileIdToFullSrc(f.id),
    };
  });
}

async function listImagesIn(folderId) {
  const q = [
    `'${folderId}' in parents`,
    "mimeType contains 'image/'",
    "trashed = false",
  ].join(" and ");
  const data = await gdriveList({ q });
  const files = mapFiles(data);
  files.sort((a, b) => a.name.localeCompare(b.name, "it", { numeric: true }));
  return files;
}

async function listImagesInRoot(rootId) {
  const q = [
    `'${rootId}' in parents`,
    "mimeType contains 'image/'",
    "trashed = false",
  ].join(" and ");
  const data = await gdriveList({ q });
  const files = mapFiles(data);
  files.sort((a, b) => a.name.localeCompare(b.name, "it", { numeric: true }));
  return files;
}

export default function GalleryDrive() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // overlay: conserviamo anche albumIndex e photoIndex per navigare
  const [preview, setPreview] = useState(null); // { src, name, albumIndex, photoIndex } | null

  const apiReady = useMemo(() => Boolean(API_KEY && ROOT_ID), []);

  useEffect(() => {
    if (!apiReady) {
      setErr(
        "Manca la configurazione: NEXT_PUBLIC_GOOGLE_API_KEY o NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID."
      );
      setLoading(false);
      return;
    }

    let stop = false;
    (async () => {
      try {
        setLoading(true);
        const [rootImages, folders] = await Promise.all([
          listImagesInRoot(ROOT_ID),
          listAlbums(ROOT_ID),
        ]);

        const albumList = [];
        if (rootImages.length)
          albumList.push({
            id: ROOT_ID,
            name: "Tutte le foto",
            photos: rootImages,
          });

        const perFolder = await Promise.all(
          folders.map(async (f) => {
            const photos = await listImagesIn(f.id);
            return { id: f.id, name: f.name, photos };
          })
        );
        albumList.push(...perFolder);

        if (!stop) setAlbums(albumList);
      } catch (e) {
        if (!stop) setErr(e.message || String(e));
      } finally {
        if (!stop) setLoading(false);
      }
    })();

    return () => {
      stop = true;
    };
  }, [apiReady]);

  // animazione di entrata cards
  useEffect(() => {
    if (loading || err) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const cards = Array.from(document.querySelectorAll(".gd-card"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in-view");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loading, err, albums]);

  // Navigazione tastiera sull'overlay
  useEffect(() => {
    if (!preview) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") handleNav("prev");
      if (e.key === "ArrowRight") handleNav("next");
      if (e.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, albums]);

  function handleNav(dir) {
    if (!preview) return;
    const { albumIndex, photoIndex } = preview;
    const photos = albums[albumIndex]?.photos || [];
    if (!photos.length) return;

    const newIndex =
      dir === "next"
        ? (photoIndex + 1) % photos.length
        : (photoIndex - 1 + photos.length) % photos.length;

    const np = photos[newIndex];
    setPreview({
      src: np.fullSrc,
      name: np.name || "Foto",
      albumIndex,
      photoIndex: newIndex,
    });
  }

  if (!apiReady) {
    return (
      <section className="gd-wrap">
        <h1 className="gd-title">Gallery</h1>
        <p className="gd-error">
          Configura .env.local con <code>NEXT_PUBLIC_GOOGLE_API_KEY</code> e{" "}
          <code>NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID</code>.
        </p>
      </section>
    );
  }

  return (
    <section className="gd-wrap">
      <h1 className="gd-title" suppressHydrationWarning>
        GALLERY
      </h1>

      {loading && (
        <div className="gd-skeleton">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="gd-skel-card" />
          ))}
        </div>
      )}

      {!!err && <p className="gd-error">Errore: {err}</p>}

      {!loading &&
        !err &&
        albums.map((al, aIdx) =>
          al.photos.length ? (
            <div key={al.id} className="gd-album">
              <div className="gd-album-header">
                <h2 className="gd-album-title">{al.name}</h2>
                <span className="gd-count">{al.photos.length} foto</span>
              </div>

              <div className="gd-grid">
                {al.photos.map((ph, pIdx) => (
                  <div
                    key={ph.id}
                    className="gd-card"
                    style={{ "--d": `${(pIdx % 12) * 35}ms` }}
                    onMouseEnter={() =>
                      setPreview({
                        src: ph.fullSrc,
                        name: ph.name || "Foto",
                        albumIndex: aIdx,
                        photoIndex: pIdx,
                      })
                    }
                  >
                    <img
                      src={ph.thumbSrc}
                      alt={ph.name || "Foto"}
                      loading="lazy"
                      className="gd-img"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}

      {/* Overlay grande con frecce */}
      {preview && (
        <div
          className="gd-hover-overlay"
          role="dialog"
          aria-label="Anteprima immagine"
        >
          <div
            className="gd-hover-backdrop"
            onClick={() => setPreview(null)}
            aria-hidden="true"
          />
          <img
            className="gd-hover-image"
            src={preview.src}
            alt={preview.name}
            referrerPolicy="no-referrer"
            draggable={false}
          />
          <button
            className="gd-nav gd-prev"
            type="button"
            onClick={() => handleNav("prev")}
            aria-label="Immagine precedente"
          >
            ❮
          </button>
          <button
            className="gd-nav gd-next"
            type="button"
            onClick={() => handleNav("next")}
            aria-label="Immagine successiva"
          >
            ❯
          </button>
        </div>
      )}
    </section>
  );
}
