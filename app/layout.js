import "../components/Navbar.css";
import "../styles/globals.css";
import "../styles/waves.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "HAP Rally Team",
  description: "Sito ufficiale HAP Rally Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="rally-theme">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
