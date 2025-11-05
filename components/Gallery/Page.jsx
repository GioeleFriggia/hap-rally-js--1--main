// app/gallery/page.jsx
export const runtime = "nodejs"; // ✅ garantisce che fs sia disponibile
export const dynamic = "force-dynamic"; // ✅ ricalcola ad ogni richiesta (utile in dev)

import fs from "fs";
import path from "path";
import dynamic from "next/dynamic";

const Lightbox = dynamic(() => import("@/components/Lightbox"), { ssr: false });

const VALID = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function walkImages(dirAbs) {
  const out = [];
  if (!dirAbs || !fs.existsSync(dirAbs)) return out;
  for (const e of fs.readdirSync(dirAbs, { withFileTypes: true })) {
    const abs = path.join(dirAbs, e.name);
    if (e.isDirectory()) out.push(...walkImages(abs));
    else if (VALID.has(path.extname(e.name).toLowerCase())) out.push(abs);
  }
  return out;
}

function toPublicUrl(abs) {
  const sep = `${path.sep}public${path.sep}`;
  const i = abs.indexOf(sep);
  const rel = i >= 0 ? abs.slice(i + sep.length) : "";
  return "/" + rel.split(path.sep).map(encodeURIComponent).join("/");
}

export const metadata = {
  title: "Gallery | HAP Rally Team",
  description: "Galleria immagini da public/foto e public/foto/foto-rally",
};

export default async function GalleryPage() {
  // 📌 Con la tua struttura, queste sono le cartelle giuste:
  const rootFoto = path.join(process.cwd(), "public", "foto");
  const rootRally = path.join(rootFoto, "foto-rally");

  // Legge immagini da entrambe (ricorsivo)
  const files = [...walkImages(rootFoto), ...walkImages(rootRally)];

  // De-duplica e mappa
  const seen = new Set();
  const images = files
    .map((abs) => {
      const src = toPublicUrl(abs);
      if (seen.has(src)) return null;
      seen.add(src);
      const base = path.basename(abs, path.extname(abs));
      return { src, alt: base.replace(/[-_]/g, " ") };
    })
    .filter(Boolean)
    .sort((a, b) => a.src.localeCompare(b.src));

  return (
    <section className="section container">
      <h1 className="gallery-title">Gallery</h1>

      {/* piccola riga di stato per capire al volo se le stiamo leggendo */}
      <p style={{ color: "#aaa", margin: "8px 0 18px" }}>
        Trovate: {images.length} immagini da <code>/public/foto</code>.
      </p>

      {images.length === 0 ? (
        <p>
          Nessuna immagine trovata in <code>public/foto</code> o{" "}
          <code>public/foto/foto-rally</code>.
        </p>
      ) : (
        <Lightbox items={images} />
      )}
    </section>
  );
}
