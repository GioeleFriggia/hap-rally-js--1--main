"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <nav
      className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${
        open ? "open" : ""
      }`}
    >
      <div className="navbar-container">
        {/* LOGO */}
        <div className="navbar-logo">
          <a href="#hero">HAP Rally Team</a>
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
            <a href="#hero" onClick={() => setOpen(false)}>
              Home
            </a>
          </li>
          <li>
            <a href="#team" onClick={() => setOpen(false)}>
              Team
            </a>
          </li>
          <li>
            <a href="#gallery" onClick={() => setOpen(false)}>
              Gallery
            </a>
          </li>
          <li>
            <a href="#news" onClick={() => setOpen(false)}>
              News
            </a>
          </li>
          <li>
            <a href="#partners" onClick={() => setOpen(false)}>
              Partners
            </a>
          </li>
          <li>
            <a href="#footer" onClick={() => setOpen(false)}>
              Contatti
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
