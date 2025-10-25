"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import "./gate.css";

export default function GatePage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("from") || "/";

  const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD || "2025@2025@Rally";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      Cookies.set("site_authorized", password, { expires: 1 });
      router.push(redirectTo);
    } else {
      setError("Password errata ❌");
    }
  };

  return (
    <div className="gate-container">
      <div className="gate-card">
        <h1>🏁 HAP Rally Team</h1>
        <p className="subtitle">Accesso riservato</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Inserisci password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Entra</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
