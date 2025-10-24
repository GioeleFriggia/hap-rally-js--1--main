"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="container nav__row">
        <Link href="/" className="nav__logo">
          W2 Pinna RALLY
        </Link>
        <nav className="nav__menu">
          <Link href="#news" className="nav__link">
            News
          </Link>
          <Link href="#academy" className="nav__link">
            Team in gara{" "}
          </Link>
          <Link href="#team" className="nav__link">
            Team
          </Link>
          <Link href="#contatti" className="nav__link">
            Contatti
          </Link>
        </nav>
        <a href="#contatti" className="nav__cta">
          Contattaci
        </a>
      </div>
    </header>
  );
}
