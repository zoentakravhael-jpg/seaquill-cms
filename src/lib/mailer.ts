import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  notifyEmail: string;
  fromName: string;
  enabled: boolean;
}

async function getSmtpConfig(): Promise<SmtpConfig | null> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "email_smtp_config" },
  });
  if (!setting?.value) return null;
  try {
    const config = JSON.parse(setting.value) as SmtpConfig;
    if (!config.enabled || !config.host || !config.user || !config.pass || !config.notifyEmail) {
      return null;
    }
    return config;
  } catch {
    return null;
  }
}

function createTransport(config: SmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  source: string;
}) {
  const config = await getSmtpConfig();
  if (!config) return; // Email not configured or disabled — skip silently

  const transporter = createTransport(config);
  const sourceLabel = data.source === "consultation" ? "Konsultasi" : data.source === "contact" ? "Form Kontak / Pop Up" : "Website";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #d97706, #ea8b12); padding: 20px 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #fff; margin: 0; font-size: 18px;">📩 Pesan Baru dari Website</h2>
        <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 13px;">Sumber: ${sourceLabel}</p>
      </div>
      <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 120px; vertical-align: top;">Nama</td>
            <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(data.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #d97706;">${escapeHtml(data.email)}</a></td>
          </tr>
          ${data.phone ? `<tr><td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Telepon</td><td style="padding: 8px 0;">${escapeHtml(data.phone)}</td></tr>` : ""}
          ${data.subject ? `<tr><td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Subject</td><td style="padding: 8px 0;">${escapeHtml(data.subject)}</td></tr>` : ""}
          <tr>
            <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Pesan</td>
            <td style="padding: 8px 0; white-space: pre-wrap;">${escapeHtml(data.message)}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
        <p style="font-size: 12px; color: #9ca3af; margin: 0;">
          Email ini dikirim otomatis dari website Seaquill. Balas langsung ke email pengirim: ${escapeHtml(data.email)}
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${config.fromName}" <${config.user}>`,
    to: config.notifyEmail,
    replyTo: data.email,
    subject: `[Seaquill] ${data.subject || "Pesan Baru"} — dari ${data.name}`,
    html,
  });
}

export async function sendTestEmail() {
  const config = await getSmtpConfig();
  if (!config) {
    throw new Error("Konfigurasi SMTP belum lengkap atau belum diaktifkan. Simpan pengaturan terlebih dahulu.");
  }

  const transporter = createTransport(config);

  await transporter.sendMail({
    from: `"${config.fromName}" <${config.user}>`,
    to: config.notifyEmail,
    subject: "[Seaquill] Test Email — Konfigurasi Berhasil ✅",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="font-size: 48px;">✅</span>
        </div>
        <h2 style="text-align: center; color: #16a34a; margin: 0 0 8px;">Konfigurasi SMTP Berhasil!</h2>
        <p style="text-align: center; color: #6b7280; font-size: 14px;">
          Email notifikasi dari website Seaquill sudah bisa dikirim ke alamat ini.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">
          Dikirim pada ${new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })}
        </p>
      </div>
    `,
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
