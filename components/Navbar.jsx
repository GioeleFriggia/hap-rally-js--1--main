"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import "./Navbar.css";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
  { href: "/partners", label: "Partners" },
  { href: "/contatti", label: "Contatti" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // chiudi il menu quando si passa a desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && open) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  return (
    <nav className={`navbar${open ? " is-open" : ""}`}>
      <div className="navbar__inner">
        <Link
          href="/"
          className="navbar__brand"
          aria-label="Team Pinna Corse - Home"
        >
          <div className="navbar__logo-wrapper">
            <Image
              src="/foto/TPC-LOGO.png"
              alt="Team Pinna Corse Logo"
              width={190}
              height={100}
              className="navbar__logo-img"
              priority
            />
          </div>
        </Link>

        {/* Hamburger: visibile solo su mobile */}
        <button
          className={`nav-toggle${open ? " is-open" : ""}`}
          aria-label="Apri menù di navigazione"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className="navbar__menu">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={pathname === href ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
