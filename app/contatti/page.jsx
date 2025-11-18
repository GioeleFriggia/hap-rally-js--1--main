// app/contatti/page.jsx
import ContactBanner from "@/components/ContactBanner";

export const metadata = {
  title: "Contatti | Team Pinna Corse",
  description:
    "Contatta il Team Pinna Corse per collaborazioni, sponsorizzazioni e informazioni.",
};

export default function ContattiPage() {
  return (
    <main className="contatti-page">
      <ContactBanner />
    </main>
  );
}
