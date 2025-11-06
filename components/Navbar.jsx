// components/Navbar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link className="navbar__logo" href="/">
          Team Pinna Corse
        </Link>
        <ul className="navbar__menu">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link className={pathname === href ? "active" : ""} href={href}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
