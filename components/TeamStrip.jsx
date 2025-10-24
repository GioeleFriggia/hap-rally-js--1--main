import Image from "next/image";
import "./TeamStrip.css";

const team = [
  {
    name: "Marco Pinna",
    role: "Pilota",
    img: "/foto/Pilotapng.png", // metti il file in /public/foto/
  },
  {
    name: "Gaetano Pinna",
    role: "Navigatore",
    img: "/foto/Navigatore.png", // metti il file in /public/foto/
  },
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
          {team.map((t, index) => (
            <div key={t.name} className="card team__card">
              <div className="team__img">
                <Image
                  src={t.img}
                  alt={t.name}
                  fill
                  sizes="(min-width: 900px) 45vw, 100vw"
                  className="team__imgEl"
                  /* Focus alto sul NAVIGATORE (index === 1) per non tagliare il casco */
                  style={{
                    objectFit: "cover",
                    objectPosition: index === 1 ? "center top" : "center",
                  }}
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
