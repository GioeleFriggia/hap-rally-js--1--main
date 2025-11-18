"use client";
import Image from "next/image";
import "./SponsorsStrip.css";

/**
 * Banner Sponsor – striscia responsive con scorrimento e hover stop.
 * Aggiungi i loghi in /public/sponsors e inseriscili qui sotto.
 * Usa immagini con sfondo trasparente quando possibile.
 */
const SPONSORS = [];

export default function SponsorsStrip() {
  // Duplico la lista per effetto “marquee” continuo
  const items = [...SPONSORS, ...SPONSORS];

  return (
    <section className="sponsors">
      <div className="sponsors__inner" aria-label="Sponsor banner">
        <div className="sponsors__track">
          {items.map((sp, i) => (
            <a
              className="sponsor"
              href={sp.href || "#"}
              key={`${sp.src}-${i}`}
              target={sp.href && sp.href !== "#" ? "_blank" : "_self"}
              rel="noopener noreferrer"
              aria-label={sp.alt}
            >
              <div className="sponsor__imgwrap">
                <Image
                  src={sp.src}
                  alt={sp.alt}
                  fill
                  sizes="200px"
                  className="sponsor__img"
                  priority={i < 6} // priorità ai primi
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
