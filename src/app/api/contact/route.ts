import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 contact submissions per 10 minutes per IP
    const ip = getClientIp(request.headers);
    const rl = rateLimit(ip, { prefix: "contact", limit: 5, windowSeconds: 600 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Terlalu banyak pengiriman pesan. Coba lagi nanti." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, subject, message, source } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Nama wajib diisi." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Pesan wajib diisi." }, { status: 400 });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: typeof phone === "string" ? phone.trim() : "",
        subject: typeof subject === "string" ? subject.trim() : "",
        message: message.trim(),
        source: source === "consultation" ? "consultation" : "contact",
      },
    });

    // Send email notification (non-blocking — don't fail the request if email fails)
    sendContactNotification({
      name: name.trim(),
      email: email.trim(),
      phone: typeof phone === "string" ? phone.trim() : undefined,
      subject: typeof subject === "string" ? subject.trim() : undefined,
      message: message.trim(),
      source: source === "consultation" ? "consultation" : "contact",
    }).catch(() => { /* email send failure is non-critical */ });

    return NextResponse.json(
      { success: true, message: "Pesan berhasil dikirim!", id: contact.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
