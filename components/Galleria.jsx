"use client";
import Image from "next/image";

const IMGS = [
  "/foto/HomePage.jpg",
  "/foto/Locandina.jpg",
  "/foto/Navigatore.png",
  "/foto/Pilotapng.png",
];

export default function Galleria() {
  return (
    <section id="gallery" className="section">
      <div className="container">
        <h2>Gallery</h2>
        <div className="grid-auto">
          {IMGS.map((src, i) => (
            <div
              key={i}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #ffffff12",
              }}
            >
              <Image
                src={src}
                alt={`Rally ${i + 1}`}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
