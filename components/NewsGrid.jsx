import Image from "next/image";
import "./NewsGrid.css";

const news = [
  {
    id: 1,
    title: "Rally Sulcis Iglesiente",
    date: "05 Mag 2025",
    img: "/foto/Locandina.jpg",
  },
  {
    id: 2,

    title: "Rally Sulcis Iglesiente",
    date: "05 Mag 2025",
    img: "/foto/Locandina.jpg",
  },
  {
    id: 3,

    title: "Rally Sulcis Iglesiente",
    date: "05 Mag 2025",
    img: "/foto/Locandina.jpg",
  },
];

export default function NewsGrid() {
  return (
    <section id="news" className="section">
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
