"use client";
/**
 * GalleryDrive.jsx
 * Galleria immagini da Google Drive (public)
 */

import { useEffect, useMemo, useState } from "react";
import Lightbox from "@/components/Lightbox"; // usa la Lightbox esterna

// ⬇️ Leggi le ENV esposte al client (NEXT_PUBLIC_*)
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const ROOT_ID = process.env.NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID; // ⬅️ corretto

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";

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

async function listImagesIn(folderId) {
  const q = [
    `'${folderId}' in parents`,
    "mimeType contains 'image/'",
    "trashed = false",
  ].join(" and ");
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

async function listImagesInRoot(rootId) {
  const q = [
    `'${rootId}' in parents`,
    "mimeType contains 'image/'",
    "trashed = false",
  ].join(" and ");
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
  const [albums, setAlbums] = useState([]);
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
        "Manca la configurazione: NEXT_PUBLIC_GOOGLE_API_KEY o NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID."
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
          <code>NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID</code>.
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
