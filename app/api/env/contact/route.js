import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { company, name, email, phone, message, _hp } = body || {};

    // Honeypot
    if (_hp) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // Validazione minima
    if (!company || !name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Campi obbligatori mancanti." }),
        { status: 400 }
      );
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return new Response(JSON.stringify({ error: "Email non valida." }), {
        status: 400,
      });
    }

    // SMTP transport (Gmail con app password oppure provider custom)
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE, // "true" / "false"
      SMTP_USER,
      SMTP_PASS,
      CONTACT_TO, // destinatario (email team)
      CONTACT_FROM, // mittente visibile (es: "HAP Rally <noreply@haprallyteam.example>")
    } = process.env;

    if (
      !SMTP_HOST ||
      !SMTP_PORT ||
      !SMTP_USER ||
      !SMTP_PASS ||
      !CONTACT_TO ||
      !CONTACT_FROM
    ) {
      return new Response(
        JSON.stringify({ error: "SMTP non configurato sul server." }),
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: String(SMTP_SECURE).toLowerCase() === "true",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const subject = `Nuova richiesta collaborazione – ${company}`;
    const text = [
      `Azienda: ${company}`,
      `Nome: ${name}`,
      `Email: ${email}`,
      `Telefono: ${phone || "-"}`,
      `---`,
      `Messaggio:`,
      message,
    ].join("\n");

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5;color:#111">
        <h2>Nuova richiesta di collaborazione</h2>
        <p><strong>Azienda:</strong> ${escapeHtml(company)}</p>
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefono:</strong> ${escapeHtml(phone || "-")}</p>
        <hr/>
        <p><strong>Messaggio:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    await transporter.sendMail({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email, // rispondi direttamente allo sponsor
      subject,
      text,
      html,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("CONTACT API ERROR:", err);
    return new Response(JSON.stringify({ error: "Errore durante l'invio." }), {
      status: 500,
    });
  }
}

// minimissima sanitizzazione HTML
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
