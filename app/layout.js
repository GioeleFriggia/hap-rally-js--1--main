import "../components/Navbar.css";
import "../styles/globals.css";

import Navbar from "@/components/Navbar";

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
      </body>
    </html>
  );
}
