"use client";
import Image from "next/image";
import "./TeamStrip.css";

const team = [
  { name: "Marco Pinna", role: "Pilota", img: "/foto/Pilotapng.png" },
  { name: "Gaetano Pinna", role: "Navigatore", img: "/foto/Navigatore.png" },
];

export default function TeamStrip() {
  return (
    <section id="team" className="section team">
      <div className="container">
        <div className="team__head">
          <h2 className="title">Il nostro equipaggio</h2>
          <p className="muted">
            Due uomini, una sola missione: tagliare il traguardo più veloci di
            tutti.
          </p>
        </div>

        <div className="team__grid team__grid--two">
          {team.map((t, i) => (
            <div key={t.name} className="card team__card">
              <div className="team__img">
                <Image
                  src={t.img}
                  alt={t.name}
                  fill
                  className="team__imgEl"
                  sizes="(min-width: 900px) 45vw, 100vw"
                  // tengo il volto un filo più alto sul navigatore
                  style={{ objectPosition: i === 1 ? "center 40%" : "center" }}
                  priority={i === 0}
                />
                <div className="team__overlay" />
              </div>

              <div className="team__body">
                <h3 className="team__name">{t.name}</h3>
                <p className="team__role">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
