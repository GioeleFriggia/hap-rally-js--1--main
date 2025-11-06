"use client";
/**
 * GalleryDrive.jsx
 * Galleria immagini da Google Drive (public):
 * - legge gli ALBUM come sotto-cartelle della ROOT
 * - mostra anteprime con thumbnailLink
 * - apre lightbox con immagine full usando alt=media
 *
 * Requisiti .env.local:
 *   NEXT_PUBLIC_GOOGLE_API_KEY=...
 *   DRIVE_ROOT_FOLDER_ID=...
 */

import { useEffect, useMemo, useState } from "react";
// import "./GalleryDrive.css";
import GalleryDrive from "@/components/GalleryDrive";

const API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
const ROOT_ID = process.env.DRIVE_ROOT_FOLDER_ID;

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";

/** URL immagine FULL: endpoint alt=media (richiede file pubblico) */
const fileIdToFullSrc = (id) =>
  `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
    id
  )}?alt=media&key=${encodeURIComponent(API_KEY)}`;

/** Query helper con campi ridotti per performance */
async function gdriveList(params) {
  const u = new URL(DRIVE_API);
  Object.entries({
    key: API_KEY,
    spaces: "drive",
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
    pageSize: 1000,
    // chiediamo anche thumbnailLink per le anteprime
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

/** Sotto-cartelle della root = album */
async function listAlbums(rootId) {
  const q = [
    `'${rootId}' in parents`,
    "mimeType = 'application/vnd.google-apps.folder'",
    "trashed = false",
  ].join(" and");

  const data = await gdriveList({ q });
  const folders = (data.files || []).sort((a, b) =>
    a.name.localeCompare(b.name, "it", { numeric: true })
  );
  return folders;
}

/** Immagini in una cartella */
async function listImagesIn(folderId) {
  const q = [
    `'${folderId}' in parents`,
    "mimeType contains 'image/'",
    "trashed = false",
  ].join(" and");
  const data = await gdriveList({ q });

  const files = (data.files || []).map((f) => {
    // thumbnailLink tipicamente arriva come ...=s220 (possiamo forzare una dimensione maggiore)
    const thumb = f.thumbnailLink
      ? f.thumbnailLink.replace(/=s\d+(-c)?$/, "=s1000")
      : fileIdToFullSrc(f.id); // fallback

    return {
      id: f.id,
      name: f.name,
      thumbSrc: thumb,
      fullSrc: fileIdToFullSrc(f.id),
    };
  });

  files.sort((a, b) => a.name.localeCompare(b.name, "it", { numeric: true }));
  return files;
}

/** (Opzionale) immagini direttamente nella root */
async function listImagesInRoot(rootId) {
  const q = [
    `'${rootId}' in parents`,
    "mimeType contains 'image/'",
    "trashed = false",
  ].join(" and");
  const data = await gdriveList({ q });

  const files = (data.files || []).map((f) => {
    const thumb = f.thumbnailLink
      ? f.thumbnailLink.replace(/=s\d+(-c)?$/, "=s1000")
      : fileIdToFullSrc(f.id);
    return {
      id: f.id,
      name: f.name,
      thumbSrc: thumb,
      fullSrc: fileIdToFullSrc(f.id),
    };
  });

  files.sort((a, b) => a.name.localeCompare(b.name, "it", { numeric: true }));
  return files;
}

export default function GalleryDrive() {
  const [albums, setAlbums] = useState([]); // [{id,name,photos:[{id,thumbSrc,fullSrc,name}]}]
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [lightbox, setLightbox] = useState({
    open: false,
    albumIdx: 0,
    photoIdx: 0,
  });

  const apiReady = useMemo(() => Boolean(API_KEY && ROOT_ID), []);

  useEffect(() => {
    if (!apiReady) {
      setErr(
        "Manca la configurazione: NEXT_PUBLIC_GOOGLE_API_KEY o DRIVE_ROOT_FOLDER_ID."
      );
      setLoading(false);
      return;
    }

    let stop = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        // immagini in root + album (sotto-cartelle)
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
        if (!stop) setErr(e.message || String(e));
      } finally {
        if (!stop) setLoading(false);
      }
    })();

    return () => {
      stop = true;
    };
  }, [apiReady]);

  if (!apiReady) {
    return (
      <section className="gd-wrap">
        <h1 className="gd-title">Gallery</h1>
        <p className="gd-error">
          Configura .env.local con <code>NEXT_PUBLIC_GOOGLE_API_KEY</code> e{" "}
          <code>DRIVE_ROOT_FOLDER_ID</code>.
        </p>
      </section>
    );
  }

  return (
    <section className="gd-wrap">
      <h1 className="gd-title">Gallery</h1>

      {loading && (
        <div className="gd-skeleton">
          {Array.from({ length: 9 }).map((_, i) => (
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
                  <button
                    key={ph.id}
                    className="gd-card"
                    onClick={() =>
                      setLightbox({
                        open: true,
                        albumIdx: aIdx,
                        photoIdx: pIdx,
                      })
                    }
                    aria-label={`Apri ${ph.name}`}
                    title={ph.name}
                  >
                    <img
                      src={ph.thumbSrc}
                      alt={ph.name || "Foto"}
                      loading="lazy"
                      className="gd-img"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null
        )}

      {lightbox.open && (
        <Lightbox
          albums={albums}
          state={lightbox}
          onClose={() => setLightbox((s) => ({ ...s, open: false }))}
          onPrev={() =>
            setLightbox((s) => {
              const album = albums[s.albumIdx];
              const prev =
                (s.photoIdx - 1 + album.photos.length) % album.photos.length;
              return { ...s, photoIdx: prev };
            })
          }
          onNext={() =>
            setLightbox((s) => {
              const album = albums[s.albumIdx];
              const next = (s.photoIdx + 1) % album.photos.length;
              return { ...s, photoIdx: next };
            })
          }
        />
      )}
    </section>
  );
}

function Lightbox({ albums, state, onClose, onPrev, onNext }) {
  const album = albums[state.albumIdx];
  const photo = album?.photos?.[state.photoIdx];
  if (!photo) return null;

  return (
    <div className="gd-lightbox" role="dialog" aria-modal="true">
      <button className="gd-close" onClick={onClose} aria-label="Chiudi">
        ✕
      </button>

      <button className="gd-nav gd-prev" onClick={onPrev} aria-label="Prev">
        ‹
      </button>

      <figure className="gd-figure">
        <img
          src={photo.fullSrc}
          alt={photo.name || "Foto"}
          className="gd-full"
          referrerPolicy="no-referrer"
        />
        {photo.name ? (
          <figcaption className="gd-caption">{photo.name}</figcaption>
        ) : null}
      </figure>

      <button className="gd-nav gd-next" onClick={onNext} aria-label="Next">
        ›
      </button>
    </div>
  );
}
