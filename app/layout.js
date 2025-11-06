import "../styles/globals.css";
import "@/components/Navbar.css";
import "../styles/font-global.css";

import Navbar from "@/components/Navbar";
import { Courier_Prime } from "next/font/google";

export const metadata = {
  title: "HAP Rally Team",
  description: "Sito ufficiale del team rally",
};

const typewriter = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-typewriter",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className={`rally-theme ${typewriter.variable}`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
