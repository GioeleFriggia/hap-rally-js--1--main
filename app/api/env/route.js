export async function GET() {
  const k = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
  const r = process.env.NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID || "";
  // NON stampiamo tutto: solo le prime/ultime cifre
  const mask = (s) => (s ? `${s.slice(0, 6)}…${s.slice(-4)}` : "(missing)");
  return new Response(
    JSON.stringify({
      NEXT_PUBLIC_GOOGLE_API_KEY: mask(k),
      NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID: mask(r),
      ok: Boolean(k && r),
    }),
    { headers: { "content-type": "application/json" } }
  );
}
