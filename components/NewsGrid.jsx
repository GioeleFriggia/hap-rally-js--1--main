import Image from "next/image";
import "./NewsGrid.css";

const news = [
  {
    id: 1,
    title: "Come diventare Pilota di Rally",
    date: "05 Mag 2025",
    img: "/foto/Locandina.jpg",
  },
  {
    id: 2,
    title: "Cos’è una Rally Experience?",
    date: "05 Mag 2025",
    img: "/foto/Locandina.jpg",
  },
  {
    id: 3,
    title: "HAP al Rally Racing Meeting",
    date: "10 Gen 2025",
    img: "/foto/Locandina.jpg",
  },
];

export default function NewsGrid() {
  return (
    <section
      id="news"
      className="section"
      /* ↓ SOLO SPACING: avvicina la sezione al blocco precedente,
         senza toccare colori o layout definiti nel CSS */
      style={{ marginTop: "-30px", paddingTop: "40px" }}
    >
      <div className="container">
        <h2 className="title">Scopri tutte le nostre news</h2>
        <div className="news">
          {news.map((n) => (
            <article key={n.id} className="card card-hover news__card">
              <div className="news__img">
                <Image src={n.img} alt={n.title} fill className="news__imgEl" />
              </div>
              <div className="news__body">
                <div className="news__date">{n.date}</div>
                <h3 className="news__title">{n.title}</h3>
                <button className="news__more">Read More</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
