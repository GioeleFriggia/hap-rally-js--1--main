"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import "./gate.css";

// Il contenuto reale che usa useSearchParams
function GateContent() {
  const params = useSearchParams();

  // Leggi eventuali query ?to=/qualcosa&key=abc
  const to = params.get("to") || "/";
  const key = params.get("key") || "";

  return (
    <section className="gate-wrap">
      <h1 className="gate-title">Gate</h1>
      <p className="gate-desc">Parametri letti dalla URL:</p>
      <ul className="gate-list">
        <li>
          <strong>to:</strong> {to}
        </li>
        <li>
          <strong>key:</strong> {key || "(nessuna chiave)"}
        </li>
      </ul>
      <p className="gate-note">
        Questa pagina è client-side e avvolta in Suspense per rispettare Next
        15.
      </p>
    </section>
  );
}

// Avvolgiamo il componente che usa useSearchParams in <Suspense>
export default function GatePage() {
  return (
    <Suspense fallback={<div className="gate-fallback" />}>
      <GateContent />
    </Suspense>
  );
}
