import "./StatsStrip.css";

/* ✅ Singola card statistica */
const Stat = ({ label, value }) => (
  <div className="stat">
    <div className="stat__glow" />
    <div className="stat__value">{value}</div>
    <div className="stat__label">{label}</div>
  </div>
);

export default function StatsStrip() {
  return (
    <section className="section bg-grid rally-lines">
      <div className="container stats">
        <Stat label="Cilindrata" value="1600 cc" />
        <Stat label="Ore di messa a punto" value="500+" />
        <Stat label="Pneumatici consumati" value="400+" />
        <Stat label="Km di speciali percorsi" value="20.000+" />
      </div>
    </section>
  );
}
