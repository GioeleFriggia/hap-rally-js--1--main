"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import "./TeamStrip.css";

const team = [
  {
    name: "Gaetano Pinna",
    role: "Navigatore",
    img: "/foto/Navigatore2.jpg",
    fit: "contain", // vogliamo vedere tutta la foto
    position: "center",
  },
  {
    name: "Marco Pinna",
    role: "Pilota",
    img: "/foto/Pilotapng.png",
    fit: "cover", // resta “full card” come prima
    position: "center 40%",
  },
];

export default function TeamStrip() {
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setBannerVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

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

        {/* Banner dopo il titolo */}
        <div className={`team__banner ${bannerVisible ? "is-visible" : ""}`}>
          <Image
            src="/foto/Homepage2.png"
            alt="Team Pinna Corse - action shot"
            fill
            className="team__bannerImg"
            sizes="(min-width: 1200px) 1100px, (min-width: 900px) 88vw, 100vw"
          />
          <div className="team__bannerShade" />
        </div>

        <div className="team__grid team__grid--two">
          {team.map((t) => (
            <div key={t.name} className="card team__card">
              <div className="team__img">
                <Image
                  src={t.img}
                  alt={t.name}
                  fill
                  className={`team__imgEl ${
                    t.fit === "contain" ? "team__imgEl--contain" : ""
                  }`}
                  sizes="(min-width: 900px) 45vw, 100vw"
                  style={{ objectPosition: t.position }}
                  priority={t.name === "Gaetano Pinna"}
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
