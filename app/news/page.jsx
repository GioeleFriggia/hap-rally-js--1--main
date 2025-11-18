"use client";

import { useState } from "react";
import Image from "next/image";
import "./NewsTimeline.css";

/* ============================
   EVENTI DELLA TIMELINE
============================ */

const EVENTS = [
  {
    id: 1,
    type: "Rally",
    title: "3° Rally Sulcis Iglesiente",
    desc: "Prova speciale Perdaxius con animazione, area giochi e DJ set serale.",
    location: "Perdaxius (SU)",
    time: "Dalle 09:30 alle 23:00",
    month: "MAR",
    day: "23",
    year: 2025,
    image: "/foto/Locandina.jpg",
    stages: [
      "Prova speciale Perdaxius 1° passaggio",
      "Prova speciale Perdaxius 2° passaggio",
      "DJ set e animazione serale",
    ],
  },
  {
    id: 2,
    type: "Shakedown",
    title: "Test Pre-Gara",
    desc: "Sessioni di setup vettura, prove partenza e raccolta dati telemetria.",
    location: "Shakedown locale",
    time: "Pomeriggio e sera",
    month: "MAG",
    day: "10",
    year: 2025,
    image: "/foto/Locandina.jpg",
    stages: ["Setup vettura", "Prove partenza", "Raccolta dati telemetria"],
  },
  {
    id: 3,
    type: "Experience",
    title: "Rally Experience Day",
    desc: "Esperienza completa con briefing, test drive e sessioni su pista.",
    location: "Impianto kart / pista privata",
    time: "Tutto il giorno",
    month: "GIU",
    day: "01",
    year: 2025,
    image: "/foto/Locandina.jpg",
    stages: ["Briefing piloti", "Test drive", "Sessione su pista controllata"],
  },
];

/* ============================
   COMPONENTE PAGINA
============================ */

export default function NewsTimelinePage() {
  const [activeEvent, setActiveEvent] = useState(null);

  const toggleModal = (event) => {
    if (activeEvent?.id === event.id) {
      setActiveEvent(null);
    } else {
      setActiveEvent(event);
    }
  };

  const closeModal = () => setActiveEvent(null);

  const CURRENT_YEAR = new Date().getFullYear();

  return (
    <section className="news-timeline">
      <div className="news-timeline__inner">
        {/* ============================
            HEADER — TITOLO + SOTTOTITOLO
        ============================= */}

        <header className="news-timeline__head">
          <p className="news-timeline__eyebrow">CALENDARIO & EVENTI</p>

          <h1 className="news-timeline__title">
            La Stagione Rally: Eventi, Prove Speciali e Test
          </h1>

          <p className="news-timeline__subtitle">
            Le locandine ufficiali, le date e le prove speciali dei nostri
            eventi.
          </p>
        </header>

        {/* ============================
            LISTA AD ANNO
        ============================= */}

        <div className="timeline-list">
          <div className="timeline-year-block">
            <div className="timeline-year-chip">
              <span className="timeline-year-chip__label">SEASON</span>
              <span className="timeline-year-chip__year">{CURRENT_YEAR}</span>
            </div>

            {EVENTS.filter((e) => e.year === 2025).map((event) => (
              <div className="event-card" key={event.id}>
                <span className="event-card__rail">
                  <span className="event-card__dot"></span>
                </span>

                <div
                  className="event-card__body"
                  onClick={() => toggleModal(event)}
                >
                  <div className="event-card__image-wrap">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="event-card__image"
                      sizes="200px"
                    />
                  </div>

                  <div className="event-card__content">
                    <span className="event-card__badge">{event.type}</span>
                    <h3 className="event-card__title">{event.title}</h3>
                    <p className="event-card__desc">{event.desc}</p>
                    <p className="event-card__extra">
                      📍 {event.location} · 🕒 {event.time}
                    </p>
                  </div>

                  <div className="event-card__date">
                    <span className="event-card__month">{event.month}</span>
                    <span className="event-card__day">{event.day}</span>
                    <span className="event-card__year-small">{event.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================
            MODAL — APERTURA LOCANDINA
        ============================= */}

        {activeEvent && (
          <div className="timeline__modal-backdrop">
            <div className="timeline__modal">
              <button className="timeline__modal-close" onClick={closeModal}>
                ✕
              </button>

              <div className="timeline__modal-img-wrap" onClick={closeModal}>
                <Image
                  src={activeEvent.image}
                  alt={activeEvent.title}
                  fill
                  className="timeline__modal-img"
                  sizes="700px"
                />
              </div>

              <div className="timeline__modal-body">
                <span className="event-card__badge event-card__badge--modal">
                  {activeEvent.type}
                </span>

                <p className="event-card__date-text">
                  {activeEvent.day} {activeEvent.month} {activeEvent.year}
                </p>

                <h3 className="event-card__title">{activeEvent.title}</h3>
                <p className="event-card__desc">{activeEvent.desc}</p>
                <p className="event-card__extra">
                  📍 {activeEvent.location} — 🕒 {activeEvent.time}
                </p>

                <ul className="timeline__stages">
                  {activeEvent.stages.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
