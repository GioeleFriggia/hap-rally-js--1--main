"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import "./Hero.css";

export default function Hero() {
  const titleText = "Team Pinna Corse";
  const subtitleText = "Passione, precisione e potenza.";

  const [displayedTitle, setDisplayedTitle] = useState("");
  const [displayedSubtitle, setDisplayedSubtitle] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const titleInterval = setInterval(() => {
      setDisplayedTitle(titleText.slice(0, i + 1));
      i++;
      if (i === titleText.length) {
        clearInterval(titleInterval);
        // Dopo che finisce il titolo, aspetta un attimo e inizia il sottotitolo
        setTimeout(() => typeSubtitle(), 500);
      }
    }, 120);

    const typeSubtitle = () => {
      let j = 0;
      const subtitleInterval = setInterval(() => {
        setDisplayedSubtitle(subtitleText.slice(0, j + 1));
        j++;
        if (j === subtitleText.length) {
          clearInterval(subtitleInterval);
          setShowCursor(false); // nasconde il cursore al termine di tutto
        }
      }, 60);
    };

    return () => clearInterval(titleInterval);
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
      </div>

      <div className="hero__overlay">
        <div className="hero__content">
          <h1 className="hero__title">
            {displayedTitle}
            {showCursor && <span className="cursor">|</span>}
          </h1>
          <p className="hero__subtitle">{displayedSubtitle}</p>
        </div>
      </div>
    </section>
  );
}
