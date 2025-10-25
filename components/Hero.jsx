"use client";
import Image from "next/image";
import "./Hero.css";

export default function Hero() {
  return (
    <section id="hero" className="hero">
      {/* Immagine principale */}
      <div
        className="hero__media"
        style={{ position: "relative", width: "100%", minHeight: "60vh" }}
      >
        <Image
          src="/foto/HomePage.jpg"
          alt="Auto rally in azione"
          fill
          sizes="100vw"
          priority
          unoptimized
          className="hero__img"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Testo centrale (se vuoi riattivarlo, togli i commenti)
      <div className="hero__overlay">
        <div className="hero__content">
          <h1 className="hero__title">HAP RALLY TEAM</h1>
          <p className="hero__subtitle">
            Passione, velocità e adrenalina pura.
          </p>
        </div>
      </div>
      */}
    </section>
  );
}
