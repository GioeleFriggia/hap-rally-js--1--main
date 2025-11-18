// app/layout.js
import "../styles/globals.css"; // CSS globali esistenti
import "@/components/Navbar.css"; // Navbar globale

import Navbar from "@/components/Navbar";
import SponsorsStrip from "@/components/SponsorsStrip";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Team Pinna Corse",
  description:
    "Sito ufficiale del Team Pinna Corse. News, eventi, rally, foto e contatti.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="rally-theme">
        <Navbar />
        <main>{children}</main>

        {/* Banner sponsor visibile su tutte le pagine */}
        <SponsorsStrip />

        {/* Footer globale */}
        <Footer />
      </body>
    </html>
  );
}
