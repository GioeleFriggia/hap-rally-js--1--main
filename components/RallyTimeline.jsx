"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import "./RallyTimeline.css";

// ⚠️ CAMBIA i path delle locandine con i tuoi file reali in /public/foto/...
const EVENTS = [
  {
    id: "sulcis-2025",
    title: "Rally Sulcis Iglesiente",
    date: "2025-03-15", // usato per ordinare e per l'anno
    displayDate: "15–16 Marzo 2025",
    time: "Verifiche 08:00 · Partenza 10:00",
    location: "Sulcis Iglesiente (SU)",
    stages: "PS1 Montevecchio · PS2 Arbus · PS3 Fluminimaggiore",
    poster: "/foto/Locandina.jpg",
  },
  {
    id: "asinara-2025",
    title: "Rally Golfo dell'Asinara",
    date: "2025-05-10",
    displayDate: "10–11 Maggio 2025",
    time: "Shakedown 08:30 · Start 11:00",
    location: "Porto Torres (SS)",
    stages: "PS1 Platamona · PS2 Stintino · PS3 Argentiera",
    poster: "/foto/Locandina.jpg",
  },
  {
    id: "costa-smeralda-2025",
    title: "Rally Costa Smeralda",
    date: "2025-09-20",
    displayDate: "20–21 Settembre 2025",
    time: "Partenza 09:00 · Arrivo 18:30",
    location: "Olbia (SS)",
    stages: "PS1 Monte Lerno · PS2 Alà dei Sardi · PS3 Loelle",
    poster: "/foto/Locandina.jpg",
  },
  // 👇 Quando avrai le gare 2026, 2027… aggiungi qui
  /*
  {
    id: "nome-2026",
    title: "Nome Rally 2026",
    date: "2026-03-10",
    displayDate: "10–11 Marzo 2026",
    time: "Orari…",
    location: "Località…",
    stages: "PS1 … · PS2 …",
    poster: "/foto/locandina-2026.jpg",
  },
  */
];

export default function RallyTimeline() {
  const [selected, setSelected] = useState(null);

  // Ordino gli eventi per data e li raggruppo per anno
  const groupedByYear = useMemo(() => {
    const sorted = [...EVENTS].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    return sorted.reduce((acc, ev) => {
      const year = new Date(ev.date).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(ev);
      return acc;
    }, {});
  }, []);

  const years = useMemo(
    () => Object.keys(groupedByYear).sort((a, b) => Number(a) - Number(b)),
    [groupedByYear]
  );

  const handleYearClick = (year) => {
    const el = document.getElementById(`nt-year-${year}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <section id="news-timeline" className="nt">
        <div className="nt__inner">
          {/* HEADER + NAV ANNI */}
          <header className="nt__header">
            <p className="nt__eyebrow">Calendario Gare</p>
            <h1 className="nt__title">Timeline Rally</h1>
            <p className="nt__subtitle">
              Tutte le gare del <strong>Team Pinna Corse</strong> dal{" "}
              <strong>2025</strong> in avanti: locandine ufficiali, date, orari
              di partenza e descrizione delle prove speciali.
            </p>

            <nav className="nt__yearNav" aria-label="Seleziona anno">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  className="nt__yearPill"
                  onClick={() => handleYearClick(year)}
                >
                  {year}
                </button>
              ))}
            </nav>
          </header>

          {/* TIMELINE */}
          {years.map((year) => (
            <section
              key={year}
              className="nt__yearBlock"
              id={`nt-year-${year}`}
              aria-label={`Stagione rally ${year}`}
            >
              <div className="nt__yearBadgeWrap">
                <div className="nt__yearBadge">{year}</div>
              </div>

              <div className="nt__items">
                {groupedByYear[year].map((event, idx) => {
                  const sideClass =
                    idx % 2 === 0 ? "nt__item--left" : "nt__item--right";

                  return (
                    <article key={event.id} className={`nt__item ${sideClass}`}>
                      {/* Punto sulla linea centrale */}
                      <div className="nt__dot" aria-hidden="true" />

                      {/* Card evento */}
                      <button
                        type="button"
                        className="nt__card"
                        onClick={() => setSelected(event)}
                      >
                        {/* Poster locandina */}
                        <div className="nt__poster">
                          <Image
                            src={event.poster}
                            alt={`Locandina ${event.title}`}
                            fill
                            sizes="(max-width: 768px) 90vw, 420px"
                            className="nt__posterImg"
                            priority={year === years[0] && idx === 0}
                          />
                        </div>

                        {/* Meta: data + orari */}
                        <div className="nt__metaRow">
                          <span className="nt__date">{event.displayDate}</span>
                          <span className="nt__time">{event.time}</span>
                        </div>

                        {/* Titolo + location */}
                        <h2 className="nt__eventTitle">{event.title}</h2>
                        <p className="nt__location">{event.location}</p>

                        {/* Prove speciali / tempi */}
                        <p className="nt__stages">
                          <span>Tempi &amp; Prove:</span> {event.stages}
                        </p>

                        <span className="nt__cta">
                          Clicca per vedere la locandina intera
                        </span>
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>

      {/* LIGHTBOX LOCANDINA INTERA */}
      {selected && (
        <div
          className="nt-lightbox"
          onClick={() => setSelected(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="nt-lightbox__inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="nt-lightbox__close"
              onClick={() => setSelected(null)}
              aria-label="Chiudi locandina"
            >
              ✕
            </button>

            <div className="nt-lightbox__imgWrap">
              <Image
                src={selected.poster}
                alt={`Locandina completa ${selected.title}`}
                fill
                sizes="100vw"
                className="nt-lightbox__img"
              />
            </div>

            <div className="nt-lightbox__info">
              <h2>{selected.title}</h2>
              <p>
                <strong>{selected.displayDate}</strong> · {selected.time}
              </p>
              <p>{selected.location}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
