"use client";

/**
 * Lightbox.jsx
 * Props:
 *  - albums: [{ id, name, photos: [{ id, name, fullSrc, thumbSrc }] }]
 *  - state: { open: bool, albumIdx: number, photoIdx: number }
 *  - onClose: () => void
 *  - onPrev: () => void
 *  - onNext: () => void
 */

export default function Lightbox({ albums, state, onClose, onPrev, onNext }) {
  const album = albums?.[state?.albumIdx];
  const photo = album?.photos?.[state?.photoIdx];
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
