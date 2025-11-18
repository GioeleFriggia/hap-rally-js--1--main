"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./ParallaxSection.css";

export default function ParallaxSection() {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = Math.max(0, vh - rect.top);
      const progress = Math.min(1, start / (vh + rect.height));
      setOffset(-20 * progress);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={ref} id="academy" className="section parallax">
      <div
        className="parallax__bg"
        style={{ transform: `translateY(${offset}%)` }}
      >
        {/* <Image
          src="https://images.unsplash.com/photo-1612197535600-5e8f302ff628?q=80&w=1920&auto=format&fit=crop"
          alt="Parallax"
          fill
          sizes="100vw"
          className="parallax__img"
        /> */}
        <div className="parallax__veil" />
      </div>

      <div className="container parallax__grid">
        <div>
          <h2 className="title">Il nostro team in gara</h2>
          <p className="muted">
            Viviamo il rally tra prove speciali e cronometri: passione, tecnica
            e spirito di squadra.
          </p>

          <ul className="list">
            <li>⚡ Adrenalina dal semaforo verde all’ultimo chilometro.</li>
            <li>🔧 Auto curate al millimetro per massime prestazioni.</li>
            <li>🧭 Pilota e navigatore in perfetta sincronia.</li>
            <li>
              🏁 Ogni arrivo è una conquista, ogni partenza un nuovo sogno.
            </li>
          </ul>

          <a href="#contatti" className="button">
            Richiedi info
          </a>
        </div>

        <div className="card parallax__card">
          <div className="video">
            <iframe
              className="video__iframe"
              src="https://www.youtube.com/embed/Scxs7L0vhZ4"
              title="Rally"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
