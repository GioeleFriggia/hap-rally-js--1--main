"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import "./TeamAbout.css";

/**
 * Mobile-first, foto alternate, reveal on scroll.
 * - Mobile: colonna singola (testo → foto)
 * - Desktop (≥900px): riga1 testo|foto, riga2 foto|testo
 * - Animazione: IntersectionObserver aggiunge .is-visible agli elementi .reveal
 */
export default function TeamAbout() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;

    // Evita animazioni se l’utente preferisce ridurre i motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      rootRef.current
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    rootRef.current.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section ref={rootRef} className="t-about" aria-labelledby="team-title">
      <div className="t-about__inner">
        <header className="t-about__head reveal">
          <h1 id="team-title" className="t-about__title">
            La nostra storia
          </h1>
          <p className="t-about__subtitle">
            Dalle prime notti in garage alle prove speciali: come è nato e
            cresciuto Team Corse Pinna.
          </p>
        </header>

        {/* ===== RIGA 1 ===== */}
        <div className="t-row">
          <article className="t-text reveal">
            <p>
              Team Corse Pinna nasce dall’incontro tra passione e
              determinazione. All’inizio eravamo solo un piccolo gruppo di amici
              con la voglia di correre e di sporcarci le mani tra bulloni e
              centraline. Col tempo sono arrivati i primi risultati, i partner e
              una struttura che ci ha permesso di crescere senza perdere
              l’anima.
            </p>
          </article>

          <figure className="t-media reveal reveal--delay-sm">
            <div className="t-imgwrap">
              <Image
                src="/foto/HomePage2.png"
                alt="Box e preparazione vettura"
                fill
                sizes="(max-width: 900px) 100vw, 48vw"
                className="t-img"
                priority
              />
            </div>
            <figcaption className="t-cap">
              Box e preparazione: dove nascono i risultati.
            </figcaption>
          </figure>
        </div>

        {/* ===== RIGA 2 (ALTERNATA) ===== */}
        <div className="t-row t-row--alt">
          <figure className="t-media reveal">
            <div className="t-imgwrap">
              <Image
                src="/foto/Homepage.png"
                alt="Azione in prova speciale"
                fill
                sizes="(max-width: 900px) 100vw, 48vw"
                className="t-img"
              />
            </div>
            <figcaption className="t-cap">
              In azione: precisione al limite, curva dopo curva.
            </figcaption>
          </figure>

          <article className="t-text reveal reveal--delay-sm">
            <p>
              Preparazione meticolosa della vettura, analisi dei dati,
              ricognizioni delle prove: il nostro lavoro parte molto prima della
              bandiera verde. In ogni gara puntiamo a migliorare un dettaglio —
              perché sono i dettagli a fare la differenza sul cronometro.
            </p>
            <p>
              Oggi il team è una famiglia di piloti, navigatori, meccanici,
              fotografi e partner che condividono lo stesso obiettivo: portare
              in gara “passione, precisione e potenza”.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
