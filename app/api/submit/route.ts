import { NextRequest, NextResponse } from "next/server";

const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbxowb4xU65OWiGL4I1q76OIwoZ1uzx8jZZ3JzNwk5ZPx6MZrTQjJ2ylSMZ58cEMlzFs/exec";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(SHEETS_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Sheets webhook returned ${res.status}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Erro interno" }, { status: 500 });
  }
}
