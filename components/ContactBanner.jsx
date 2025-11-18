"use client";
import { useState } from "react";
import "./ContactBanner.css";

export default function ContactBanner() {
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.company.trim()) return "Inserisci il nome azienda.";
    if (!form.name.trim()) return "Inserisci il tuo nome.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Email non valida.";
    if (!form.message.trim()) return "Scrivi un messaggio.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("[ContactBanner] onSubmit chiamato. Form:", form);

    const err = validate();
    if (err) {
      console.log("[ContactBanner] Validazione fallita:", err);
      setStatus({ state: "error", msg: err });
      return;
    }

    setStatus({ state: "loading", msg: "Invio in corso..." });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log("[ContactBanner] /api/contact status:", res.status);
      const data = await res.json().catch(() => ({}));
      console.log("[ContactBanner] /api/contact body:", data);

      if (!res.ok) {
        throw new Error(data?.error || "Impossibile inviare al momento.");
      }

      setStatus({
        state: "success",
        msg: "Grazie! Ti risponderemo al più presto.",
      });
      setForm({
        company: "",
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (e) {
      console.error("[ContactBanner] ERRORE:", e);
      setStatus({ state: "error", msg: e.message });
    }
  };

  return (
    <section className="c-banner" aria-labelledby="contatti-title">
      <div className="c-banner__inner">
        <div className="c-banner__head">
          <h2 id="contatti-title" className="c-banner__title">
            Collabora con Team Pinna Corse
          </h2>
          <p className="c-banner__subtitle">
            Sei un’azienda interessata a sponsorizzarci? Compila il form:
            riceveremo una email con la tua richiesta.
          </p>
        </div>

        <form className="c-form" onSubmit={onSubmit} noValidate>
          <div className="c-grid">
            <div className="c-field">
              <label htmlFor="company">Azienda *</label>
              <input
                id="company"
                name="company"
                type="text"
                required
                value={form.company}
                onChange={onChange}
                placeholder="Nome azienda"
              />
            </div>

            <div className="c-field">
              <label htmlFor="name">Nome e Cognome *</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={onChange}
                placeholder="Il tuo nome"
              />
            </div>

            <div className="c-field">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={onChange}
                placeholder="nome@azienda.com"
              />
            </div>

            <div className="c-field">
              <label htmlFor="phone">Telefono</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={onChange}
                placeholder="+39 / +353 ..."
              />
            </div>

            <div className="c-field c-field--full">
              <label htmlFor="message">Messaggio *</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={onChange}
                placeholder="Raccontaci di cosa ti occupi e che tipo di collaborazione cerchi."
              />
            </div>
          </div>

          <button
            className="c-btn"
            type="submit"
            disabled={status.state === "loading"}
            aria-busy={status.state === "loading"}
          >
            {status.state === "loading"
              ? "Invio..."
              : "Invia richiesta di collaborazione"}
          </button>

          {status.state === "success" && (
            <p className="c-alert c-alert--ok" role="status">
              {status.msg}
            </p>
          )}
          {status.state === "error" && (
            <p className="c-alert c-alert--err" role="alert">
              {status.msg}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
