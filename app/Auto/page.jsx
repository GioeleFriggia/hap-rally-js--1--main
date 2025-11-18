// /app/auto/page.jsx
import StatsStrip from "@/components/StatsStrip";

export const metadata = { title: "Auto |Team Pinna Corse" };

export default function AutoPage() {
  return (
    <section className="section container">
      <h1>La Nostra Auto</h1>
      <StatsStrip />
      {/* Aggiungi qui schede tecniche, foto, spec */}
    </section>
  );
}
