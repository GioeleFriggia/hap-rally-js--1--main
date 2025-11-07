"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link href="/" className="navbar__brand">
          <div className="navbar__logo-wrapper">
            <Image
              src="/foto/TPC-LOGO.png"
              alt="Team Pinna Corse Logo"
              width={90}
              height={90}
              className="navbar__logo-img"
              priority
            />
          </div>
        </Link>

        <ul className="navbar__menu">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={pathname === href ? "active" : ""}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
