import Image from "next/image";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <Image
        src="/foto/HomePage.jpg"
        alt="Rally night"
        fill
        priority
        sizes="100vw"
        className="hero__bg"
        style={{ objectFit: "cover", objectPosition: "center bottom" }}
      />
      {/* <div className="hero__overlay" />
      <div className="container hero__inner">
        <h1 className="hero__title">HAVE A PLUS!</h1>
        <p className="hero__subtitle">
          Rally Academy • Esperienze di guida • Team professionale dal 2007
        </p>
        <div className="hero__cta">
          <a href="#academy" className="button">
            Scopri l'Academy
          </a>
          <a href="#news" className="button button--ghost">
            Leggi le news
          </a>
        </div>
      </div>
      <div className="hero__mouse" /> */}
    </section>
  );
}
