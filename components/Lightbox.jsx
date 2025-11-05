"use client";
import { useState, useCallback, useEffect } from "react";

export default function Lightbox({ items }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = useCallback((i) => {
    setIndex(i);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + items.length) % items.length),
    [items.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % items.length),
    [items.length]
  );

  // ESC per chiudere
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, prev, next]);

  return (
    <>
      <div className="gallery-grid">
        {items.map((img, i) => (
          <button
            key={img.src}
            className="gallery-item"
            onClick={() => openAt(i)}
            aria-label={`Apri ${img.alt}`}
            title={img.alt}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="gallery-img"
            />
          </button>
        ))}
      </div>

      {open && (
        <div className="lb" role="dialog" aria-modal="true" onClick={close}>
          <button
            className="lb-nav lb-prev"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Precedente"
          >
            ‹
          </button>

          <img
            src={items[index].src}
            alt={items[index].alt}
            className="lb-img"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="lb-nav lb-next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Successiva"
          >
            ›
          </button>

          <button
            className="lb-close"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Chiudi"
            title="Chiudi"
          >
            ✕
          </button>

          <style jsx>{`
            .lb {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.85);
              display: grid;
              place-items: center;
              z-index: 9999;
            }
            .lb-img {
              max-width: 92vw;
              max-height: 86vh;
              border-radius: 12px;
              box-shadow: 0 10px 40px #0008;
            }
            .lb-close {
              position: fixed;
              top: 14px;
              right: 16px;
              font-size: 18px;
              background: #000;
              color: #fff;
              border: 1px solid #ffffff30;
              border-radius: 10px;
              padding: 8px 10px;
            }
            .lb-nav {
              position: fixed;
              top: 50%;
              transform: translateY(-50%);
              background: #000;
              color: #fff;
              border: 1px solid #ffffff30;
              border-radius: 10px;
              padding: 10px 12px;
              font-size: 28px;
            }
            .lb-prev {
              left: 12px;
            }
            .lb-next {
              right: 12px;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
