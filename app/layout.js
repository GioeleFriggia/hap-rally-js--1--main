// app/layout.js
import "../styles/globals.css"; // CSS globali esistenti
import "@/components/Navbar.css"; // Navbar globale

import Navbar from "@/components/Navbar";
import SponsorsStrip from "@/components/SponsorsStrip";
import Footer from "@/components/Footer";

export const metadata = {
  title: "HAP Rally Team",
  description: "Sito ufficiale del team rally",
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
