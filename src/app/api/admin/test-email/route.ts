import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sendTestEmail } from "@/lib/mailer";

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await sendTestEmail();
    return NextResponse.json({ message: "Email test berhasil dikirim! Cek inbox Anda." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal mengirim email test";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
