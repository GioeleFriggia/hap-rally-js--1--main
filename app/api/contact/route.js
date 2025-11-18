import sgMail from "@sendgrid/mail";
import { NextResponse } from "next/server";

const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
  console.error("[API /api/contact] Manca SENDGRID_API_KEY nelle env!");
} else {
  sgMail.setApiKey(apiKey);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { company, name, email, phone, message } = body || {};

    if (!company || !name || !email || !message) {
      return NextResponse.json(
        { error: "Dati mancanti o non validi." },
        { status: 400 }
      );
    }

    const FROM = process.env.CONTACT_FROM;
    const TO = process.env.CONTACT_TO;

    if (!FROM || !TO) {
      console.error(
        "[API /api/contact] Manca CONTACT_FROM o CONTACT_TO nelle env.",
        { FROM, TO }
      );
      return NextResponse.json(
        {
          error: "Email di mittente/destinatario non configurate.",
          debug: {
            FROM: FROM || "(mancante)",
            TO: TO || "(mancante)",
          },
        },
        { status: 500 }
      );
    }

    const msg = {
      to: TO,
      from: FROM,
      replyTo: email,
      subject: `Nuova richiesta sponsorizzazione da ${company}`,
      text: `
Azienda: ${company}
Nome: ${name}
Email: ${email}
Telefono: ${phone || "-"}

Messaggio:
${message}
      `.trim(),
      html: `
        <h2>Nuova richiesta di collaborazione dal sito Team Pinna Corse</h2>
        <p><strong>Azienda:</strong> ${company}</p>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${phone || "-"}</p>
        <hr/>
        <p><strong>Messaggio:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    };

    console.log("[API /api/contact] Invio email con SendGrid…");

    const [resp] = await sgMail.send(msg);
    console.log(
      "[API /api/contact] Email inviata OK. Status:",
      resp?.statusCode
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[API /api/contact] SENDGRID ERROR RAW:", error);

    let debug = {};
    if (error?.response?.body) {
      debug = error.response.body;
      console.error("[API /api/contact] SENDGRID RESPONSE BODY:", debug);
    }

    return NextResponse.json(
      {
        error: "Errore durante l'invio dell'email.",
        sendgrid: debug,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
