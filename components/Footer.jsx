"use client";
import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <h3 className="footer__title">Team Pinna Corse </h3>
          <p className="footer__tag">Passione, precisione e potenza.</p>
        </div>

        <nav className="footer__links">
          <div>
            <h4>Menu</h4>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/team">Team</Link>
              </li>
              <li>
                <Link href="/gallery">Gallery</Link>
              </li>
              <li>
                <Link href="/news">News</Link>
              </li>
              <li>
                <Link href="/partners">Partners</Link>
              </li>
              <li>
                <Link href="/contatti">Contatti</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Contatti</h4>
            <ul>
              <li>
                <a href="mailto:info@haprallyteam.example">
                  info@haprallyteam.example
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="footer__bottom">
        <p>© {year} Team Pinna Corse — All rights reserved.</p>
        <p className="footer__credit">Website by Gioele Friggia</p>
      </div>
    </footer>
  );
}
