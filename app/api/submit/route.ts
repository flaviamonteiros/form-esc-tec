import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "respostas.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const entry = {
      ...body,
      timestamp: new Date().toISOString(),
    };

    await mkdir(DATA_DIR, { recursive: true });

    let existing: unknown[] = [];
    try {
      const raw = await readFile(DATA_FILE, "utf-8");
      existing = JSON.parse(raw);
    } catch {
      existing = [];
    }

    existing.push(entry);
    await writeFile(DATA_FILE, JSON.stringify(existing, null, 2), "utf-8");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Erro interno" }, { status: 500 });
  }
}
