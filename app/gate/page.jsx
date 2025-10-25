"use client";
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import "./gate.css";

export default function GatePage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirectTo, setRedirectTo] = useState("/");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      if (from) setRedirectTo(from);
    }
  }, []);

  const correctPassword = useMemo(
    () => process.env.NEXT_PUBLIC_SITE_PASSWORD || "2025@2025@Rally",
    []
  );

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
