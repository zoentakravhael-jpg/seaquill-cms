import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    // Rate limit: 5 form submissions per 10 minutes per IP
    const ip = getClientIp(request.headers);
    const rl = rateLimit(ip, { prefix: "form-submit", limit: 5, windowSeconds: 600 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Terlalu banyak pengiriman. Coba lagi nanti." },
        { status: 429 }
      );
    }

    const { slug } = await params;
    const body = await request.json();

    const form = await prisma.form.findUnique({ where: { slug } });
    if (!form || form.deletedAt || form.status !== "published") {
      return NextResponse.json({ error: "Form tidak ditemukan." }, { status: 404 });
    }

    // Parse fields definition for validation
    let fields: Array<{ name: string; label: string; required: boolean; type: string }> = [];
    try { fields = JSON.parse(form.fields); } catch { /* empty */ }

    // Validate required fields
    for (const field of fields) {
      if (field.required && (!body[field.name] || String(body[field.name]).trim() === "")) {
        return NextResponse.json(
          { error: `${field.label || field.name} wajib diisi.` },
          { status: 400 }
        );
      }
    }

    // Sanitize data: only keep known field names
    const allowedNames = new Set(fields.map((f) => f.name));
    const sanitized: Record<string, string> = {};
    for (const [key, val] of Object.entries(body)) {
      if (allowedNames.has(key)) {
        sanitized[key] = String(val).slice(0, 10000); // limit value length
      }
    }

    const submissionIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
    const userAgent = (request.headers.get("user-agent") || "").slice(0, 512);

    const submission = await prisma.formSubmission.create({
      data: {
        formId: form.id,
        data: JSON.stringify(sanitized),
        ip: submissionIp,
        userAgent,
      },
    });

    // Increment submit count
    await prisma.form.update({
      where: { id: form.id },
      data: { submitCount: { increment: 1 } },
    });

    // Parse form settings for notifications
    let settings: {
      successMessage?: string;
      emailNotification?: { enabled: boolean; to: string; subject: string };
      whatsappNotification?: { enabled: boolean; phone: string; message: string };
    } = {};
    try { settings = JSON.parse(form.settings); } catch { /* empty */ }

    // Email notification (fire and forget)
    if (settings.emailNotification?.enabled && settings.emailNotification.to) {
      sendEmailNotification(settings.emailNotification, sanitized, form.name).catch(() => {});
    }

    // WhatsApp notification - return URL for redirect
    let whatsappUrl: string | null = null;
    if (settings.whatsappNotification?.enabled && settings.whatsappNotification.phone) {
      const msg = buildWhatsAppMessage(settings.whatsappNotification.message, sanitized);
      const phone = settings.whatsappNotification.phone.replace(/\D/g, "");
      whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    }

    return NextResponse.json(
      {
        success: true,
        message: settings.successMessage || "Pesan berhasil dikirim!",
        id: submission.id,
        whatsappUrl,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}

function buildWhatsAppMessage(template: string, data: Record<string, string>): string {
  let msg = template || "Pesan baru dari form:";
  for (const [key, val] of Object.entries(data)) {
    msg = msg.replaceAll(`{{${key}}}`, val);
  }
  // Remove unresolved placeholders
  msg = msg.replace(/\{\{[^}]+\}\}/g, "-");
  return msg;
}

async function sendEmailNotification(
  config: { to: string; subject: string },
  data: Record<string, string>,
  formName: string
) {
  // Build plain text body
  let body = `Form: ${formName}\n\n`;
  for (const [key, val] of Object.entries(data)) {
    body += `${key}: ${val}\n`;
  }
  body += `\nWaktu: ${new Date().toLocaleString("id-ID")}`;

  // Log the email notification (install nodemailer + set SMTP_URL to enable actual sending)
  console.log("[Email Notification]", {
    to: config.to,
    subject: config.subject,
    body,
  });
}
