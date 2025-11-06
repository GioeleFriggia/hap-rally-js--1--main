"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./gate.css";

export default function GatePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const publicPass = process.env.NEXT_PUBLIC_SITE_PASSWORD || "";
  const backTo = sp.get("from") || "/";

  useEffect(() => {
    // Se non hai impostato una password pubblica, il gate non serve
    if (!publicPass) router.replace(backTo);
  }, [publicPass, backTo, router]);

  function onSubmit(e) {
    e.preventDefault();
    if (pw === publicPass) {
      document.cookie = `site-auth=ok; Path=/; Max-Age=${
        60 * 60 * 24 * 7
      }; SameSite=Lax`;
      router.replace(backTo);
    } else {
      setErr("Password errata");
    }
  }

  return (
    <div className="gate-wrap">
      <form className="gate-card" onSubmit={onSubmit}>
        <h1>Accesso</h1>
        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="gate-input"
          autoFocus
        />
        {err && <p className="gate-error">{err}</p>}
        <button className="gate-btn" type="submit">
          Entra
        </button>
      </form>
    </div>
  );
}
