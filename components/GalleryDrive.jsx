"use client";
/**
 * GalleryDrive.jsx — Album + Masonry (mobile-first)
 */
import { useEffect, useMemo, useState } from "react";
import "./GalleryDrive.css";
import Lightbox from "@/components/Lightbox";

// 🔑 Leggo SOLO le var NEXT_PUBLIC_ (come nel tuo .env.local)
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const ROOT_ID = process.env.NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID;

// 🔍 DEBUG: controllo subito se le env arrivano al browser

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";

/** URL immagine FULL: endpoint alt=media (file pubblico) */
const fileIdToFullSrc = (id) =>
  `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
    id
  )}?alt=media&key=${encodeURIComponent(API_KEY)}`;

/** Helper generico per chiamare Drive API */
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
    console.error("Drive API error", res.status, txt);
    throw new Error(`Drive API error (${res.status}): ${txt}`);
  }

  return res.json();
}

/** Lista le sotto-cartelle (album) della cartella root */
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

function toImage(file) {
  const thumb = file.thumbnailLink
    ? file.thumbnailLink.replace(/=s\d+(-c)?$/, "=s1200")
    : fileIdToFullSrc(file.id);

  return {
    id: file.id,
    name: file.name,
    thumbSrc: thumb,
    fullSrc: fileIdToFullSrc(file.id),
  };
}

/** Immagini dentro una singola cartella (album) */
async function listImagesIn(folderId) {
  const q = [
    `'${folderId}' in parents`,
    "mimeType contains 'image/'",
    "trashed = false",
  ].join(" and ");

  const data = await gdriveList({ q });
  const files = (data.files || []).map(toImage);

  files.sort((a, b) => a.name.localeCompare(b.name, "it", { numeric: true }));
  return files;
}

/** Immagini direttamente nella cartella root */
async function listImagesInRoot(rootId) {
  const q = [
    `'${rootId}' in parents`,
    "mimeType contains 'image/'",
    "trashed = false",
  ].join(" and ");

  const data = await gdriveList({ q });
  const files = (data.files || []).map(toImage);

  files.sort((a, b) => a.name.localeCompare(b.name, "it", { numeric: true }));
  return files;
}

export default function GalleryDrive() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [activeId, setActiveId] = useState("all");
  const [lightbox, setLightbox] = useState({
    open: false,
    albumIdx: 0,
    photoIdx: 0,
  });

  const apiReady = useMemo(
    () => Boolean(API_KEY && ROOT_ID),
    [API_KEY, ROOT_ID]
  );

  useEffect(() => {
    if (!apiReady) {
      setErr(
        "Configura le variabili NEXT_PUBLIC_GOOGLE_API_KEY e NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID."
      );
      setLoading(false);
      return;
    }

    let stop = false;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const [rootImages, folders] = await Promise.all([
          listImagesInRoot(ROOT_ID),
          listAlbums(ROOT_ID),
        ]);

        const albumList = [];

        if (rootImages.length) {
          albumList.push({
            id: ROOT_ID,
            name: "Tutte le foto",
            photos: rootImages,
          });
        }

        const perFolder = await Promise.all(
          folders.map(async (f) => {
            const photos = await listImagesIn(f.id);
            return { id: f.id, name: f.name, photos };
          })
        );

        albumList.push(...perFolder);

        if (!stop) setAlbums(albumList);
      } catch (e) {
        console.error("Errore fetch gallery:", e);
        if (!stop) setErr(e.message || String(e));
      } finally {
        if (!stop) setLoading(false);
      }
    })();

    return () => {
      stop = true;
    };
  }, [apiReady]);

  const photosToShow = useMemo(() => {
    if (!albums.length) return [];
    if (activeId === "all") return albums.flatMap((a) => a.photos);
    const found = albums.find((a) => a.id === activeId);
    return found ? found.photos : [];
  }, [albums, activeId]);

  const lbAlbums = useMemo(
    () => [
      {
        id: activeId,
        name:
          activeId === "all"
            ? "Tutte le foto"
            : albums.find((a) => a.id === activeId)?.name || "",
        photos: photosToShow,
      },
    ],
    [albums, activeId, photosToShow]
  );

  const openLightbox = (idx) =>
    setLightbox({ open: true, albumIdx: 0, photoIdx: idx });

  const totalCount = albums.reduce((n, a) => n + a.photos.length, 0);

  return (
    <section className="gd-wrap">
      {/* Titolo principale */}
      <h1 className="gd-title">Galleria</h1>

      {/* Sezioni / Album */}
      <div className="gd-controls">
        <div className="gd-tabs" role="tablist" aria-label="Album">
          <button
            role="tab"
            aria-selected={activeId === "all"}
            className={`gd-tab ${activeId === "all" ? "is-active" : ""}`}
            onClick={() => setActiveId("all")}
            title="Mostra tutte le foto"
          >
            <span className="gd-tab__label">Tutte</span>
            <span className="gd-badge">{totalCount}</span>
          </button>

          {albums.map((al) => (
            <button
              key={al.id}
              role="tab"
              aria-selected={activeId === al.id}
              className={`gd-tab ${activeId === al.id ? "is-active" : ""}`}
              onClick={() => setActiveId(al.id)}
              title={al.name}
            >
              <span className="gd-tab__label">{al.name}</span>
              <span className="gd-badge">{al.photos.length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="gd-skeleton">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="gd-skel-card" />
          ))}
        </div>
      )}

      {!!err && <p className="gd-error">Errore: {err}</p>}

      {/* Masonry */}
      {!loading && !err && photosToShow.length > 0 && (
        <div className="gd-masonry">
          {photosToShow.map((ph, idx) => (
            <figure key={ph.id} className="gd-masonry-item">
              <button
                className="gd-m-card"
                onClick={() => openLightbox(idx)}
                aria-label={`Apri ${ph.name}`}
                title={ph.name}
              >
                <img
                  src={ph.thumbSrc}
                  alt={ph.name || "Foto"}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
                  className="gd-m-img"
                />
              </button>
            </figure>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox.open && (
        <Lightbox
          albums={lbAlbums}
          state={lightbox}
          onClose={() => setLightbox((s) => ({ ...s, open: false }))}
          onPrev={() =>
            setLightbox((s) => {
              const album = lbAlbums[0];
              const prev =
                (s.photoIdx - 1 + album.photos.length) % album.photos.length;
              return { ...s, photoIdx: prev };
            })
          }
          onNext={() =>
            setLightbox((s) => {
              const album = lbAlbums[0];
              const next = (s.photoIdx + 1) % album.photos.length;
              return { ...s, photoIdx: next };
            })
          }
        />
      )}
    </section>
  );
}
