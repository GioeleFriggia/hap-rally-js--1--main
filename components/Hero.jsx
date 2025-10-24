"use client";
import Image from "next/image";
import "./Hero.css";

export default function Hero() {
  return (
    <section id="hero" className="hero">
      {/* Immagine principale */}
      <div className="hero__media">
        <Image
          src="/foto/notte.png"
          alt="Auto rally in azione"
          fill
          priority
          className="hero__img"
          sizes="100vw"
        />
      </div>
      {/* Testo centrale
      <div className="hero__overlay">
        <div className="hero__content">
          <h1 className="hero__title">HAP RALLY TEAM</h1>
          <p className="hero__subtitle">
            Passione, velocità e adrenalina pura.
          </p>
        </div>
      </div> */}
    </section>
  );
}
