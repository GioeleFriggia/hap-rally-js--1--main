"use client";
import { useState, useEffect } from "react";
// 👇 AGGIUNTA
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // 👇 AGGIUNTA
  const router = useRouter();

  // Effetto trasparente → opaco con lo scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Blocca lo scroll del body quando il menu mobile è aperto
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      document.body.style.overflow = open ? "hidden" : "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // 👇 AGGIUNTA: handler generico che fa push alla rotta e chiude il menu
  const go = (e, path) => {
    e.preventDefault();
    setOpen(false);
    router.push(path);
  };

  return (
    <nav
      className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${
        open ? "open" : ""
      }`}
    >
      <div className="navbar-container">
        {/* LOGO */}
        <div className="navbar-logo">
          {/* Mantengo ancora l'anchor, ma navigo alla home page */}
          <a href="#hero" onClick={(e) => go(e, "/")}>
            HAP Rally Team
          </a>
        </div>

        {/* HAMBURGER ICON */}
        <button
          className={`hamburger modern ${open ? "active" : ""}`}
          aria-label="Apri/chiudi menu"
          onClick={() => setOpen(!open)}
        >
          <div className="bar top"></div>
          <div className="bar middle"></div>
          <div className="bar bottom"></div>
        </button>

        {/* MENU LINK */}
        <ul className={`nav-menu ${open ? "show" : ""}`}>
          <li>
            {/* Home → / */}
            <a href="#hero" onClick={(e) => go(e, "/")}>
              Home
            </a>
          </li>
          <li>
            {/* Team → /team */}
            <a href="#team" onClick={(e) => go(e, "/team")}>
              Team
            </a>
          </li>
          <li>
            {/* Gallery → /gallery */}
            <a href="#gallery" onClick={(e) => go(e, "/gallery")}>
              Gallery
            </a>
          </li>
          <li>
            {/* News → /news */}
            <a href="#news" onClick={(e) => go(e, "/news")}>
              News
            </a>
          </li>
          <li>
            {/* Partners → /partners */}
            <a href="#partners" onClick={(e) => go(e, "/partners")}>
              Partners
            </a>
          </li>
          <li>
            {/* Contatti → /contatti */}
            <a href="#footer" onClick={(e) => go(e, "/contatti")}>
              Contatti
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
