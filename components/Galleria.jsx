"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import "./Galleria.css";

/**
 * PROPS
 * - items: Array di media { src: string, width?: number, height?: number, alt?: string, caption?: string, type?: "image"|"video" }
 * - columns: numero colonne su desktop (default 4)
 */
export default function Galleria({ items = [], columns = 4 }) {
  // Normalizza: di default type = image
  const media = useMemo(
    () => items.map((it) => ({ type: "image", alt: "", ...it })),
    [items]
  );

  // Lightbox
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const onOpen = (i) => {
    setIndex(i);
    setOpen(true);
    // lock scroll
    document.documentElement.style.overflow = "hidden";
  };
  const onClose = () => {
    setOpen(false);
    document.documentElement.style.overflow = "";
  };
  const onNext = () => setIndex((i) => (i + 1) % media.length);
  const onPrev = () => setIndex((i) => (i - 1 + media.length) % media.length);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  // Reveal on scroll
  const containerRef = useRef(null);
  useEffect(() => {
    const els = containerRef.current?.querySelectorAll(".rg-card");
    if (!els?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add("in");
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [media]);

  return (
    <section className="rg-wrap">
      {/* strip superiore con titolo */}
      <div className="rg-heading">
        <h2 className="rg-title">
          <span className="rg-icon" aria-hidden>
            ▸
          </span>{" "}
          Gallery
        </h2>
        <p className="rg-sub">Scatti di gara • test • paddock</p>
      </div>

      {/* Masonry */}
      <div
        className="rg-masonry"
        style={{ ["--cols"]: columns }}
        ref={containerRef}
      >
        {media.map((m, i) => (
          <article
            key={i}
            className="rg-card"
            onClick={() => onOpen(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" ? onOpen(i) : null)}
          >
            {m.type === "video" ? (
              <div className="rg-video-thumb">
                <video src={m.src} preload="metadata" muted playsInline />
                <span className="rg-badge">VIDEO</span>
              </div>
            ) : (
              <div className="rg-img">
                <Image
                  src={m.src}
                  alt={m.alt || "Rally"}
                  width={m.width || 1200}
                  height={m.height || 800}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
                  priority={i < 4}
                />
              </div>
            )}
            {m.caption ? <div className="rg-cap">{m.caption}</div> : null}
          </article>
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div className="rg-lightbox" onClick={onClose}>
          <button className="rg-close" onClick={onClose} aria-label="Chiudi">
            ✕
          </button>
          <button
            className="rg-nav rg-prev"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Precedente"
          >
            ‹
          </button>
          <button
            className="rg-nav rg-next"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Successivo"
          >
            ›
          </button>

          <div className="rg-stage" onClick={(e) => e.stopPropagation()}>
            {media[index].type === "video" ? (
              <video
                src={media[index].src}
                controls
                autoPlay
                playsInline
                className="rg-media"
              />
            ) : (
              <Image
                src={media[index].src}
                alt={media[index].alt || "Rally"}
                width={media[index].width || 1600}
                height={media[index].height || 1066}
                className="rg-media"
                sizes="100vw"
                priority
              />
            )}
            {media[index].caption ? (
              <div className="rg-lb-cap">{media[index].caption}</div>
            ) : null}
          </div>

          {/* overlay speed lines */}
          <div className="rg-speedlines" aria-hidden />
          <div className="rg-grain" aria-hidden />
        </div>
      )}
    </section>
  );
}
