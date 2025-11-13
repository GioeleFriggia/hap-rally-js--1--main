import ContactBanner from "@/components/ContactBanner";
import SponsorsStrip from "@/components/SponsorsStrip"; // opzionale: utile mostrarlo anche qui

export const metadata = {
  title: "Contatti | HAP Rally Team",
  description: "Contatti e collaborazioni (sponsorship) con HAP Rally Team.",
};

export default function ContattiPage() {
  return (
    <>
      <section className="section" style={{ padding: "32px 16px 8px" }}>
        <div className="container">
          <h1 className="title">Contatti</h1>
          <p className="muted" style={{ maxWidth: 70 + "ch" }}>
            Per richieste generiche usa il form qui sotto o scrivici a{" "}
            <a href="mailto:info@haprallyteam.example">
              info@haprallyteam.example
            </a>
            . Per collaborazioni e sponsorizzazioni, compila il banner: la tua
            email arriverà direttamente al nostro team.
          </p>
        </div>
      </section>

      <ContactBanner />

      {/* Se vuoi ribadire i partner anche qui */}
      <SponsorsStrip />
    </>
  );
}
