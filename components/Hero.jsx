"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "./Hero.css";

export default function Hero() {
  const TITLE = "Team Pinna Corse";
  const SUBTITLE = "Passione, precisione e potenza.";

  const TITLE_MS = 110;
  const SUBTITLE_MS = 65;
  const AFTER_TITLE_DELAY = 350;

  const [titleOut, setTitleOut] = useState("");
  const [subOut, setSubOut] = useState("");
  const [typing, setTyping] = useState(true);

  const rafRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const typeWithRAF = (text, setter, perCharMs, onDone) => {
      let i = 0;
      let last = performance.now();

      const step = (now) => {
        if (now - last >= perCharMs) {
          last = now;
          i++;
          setter(text.slice(0, i));
        }
        if (i < text.length) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          onDone && onDone();
        }
      };

      setter(text.slice(0, 2));
      i = 2;
      last = performance.now();
      rafRef.current = requestAnimationFrame(step);
    };

    typeWithRAF(TITLE, setTitleOut, TITLE_MS, () => {
      timeoutRef.current = setTimeout(() => {
        typeWithRAF(SUBTITLE, setSubOut, SUBTITLE_MS, () => {
          setTyping(false);
        });
      }, AFTER_TITLE_DELAY);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section id="hero" className="hero">
      <div className="hero__media">
        <Image
          src="/foto/Homepage.png"
          alt="Auto rally in azione"
          fill
          sizes="100vw"
          priority
          unoptimized
          className="hero__img"
        />
        <div className="hero__darken" />
      </div>

      <div className="hero__overlay">
        <div className="hero__content">
          <h1 className="hero__title">
            {titleOut}
            {typing && (
              <span className="cursor" aria-hidden="true">
                |
              </span>
            )}
          </h1>

          <p className="hero__subtitle">{subOut}</p>
        </div>
      </div>
    </section>
  );
}
