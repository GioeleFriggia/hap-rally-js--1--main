export const metadata = {
  title: "HAP Rally – Team",
  description: "Passione, competizioni e spirito di squadra.",
};

import "../styles/globals.css";
import "../styles/waves.css"; // contiene il tema rally
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="rally-theme">
        {" "}
        {/* <<< attiva il tema */}
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
