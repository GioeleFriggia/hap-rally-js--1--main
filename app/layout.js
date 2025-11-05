// app/layout.js
import "../components/Navbar.css";
import "../styles/globals.css";

import "../styles/globals.css";

import "@/components/Gallery/Gallery.css";

import Navbar from "@/components/Navbar";

export const metadata = {
  title: "HAP Rally Team",
  description: "Sito ufficiale del team rally",
  // ✅ Favicon & icone
  icons: {
    icon: [
      { url: "/favicon.ico" }, // metti un file in public/favicon.ico
      { url: "/foto/Navigatore.png", type: "image/png", sizes: "32x32" }, // fallback se non hai l'ico
    ],
    apple: [
      { url: "/foto/Navigatore.png", sizes: "180x180", type: "image/png" },
    ],
  },
  // (opzionale ma utile)
  metadataBase: new URL("https://hap-rally-js--1--main.vercel.app"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="rally-theme">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
