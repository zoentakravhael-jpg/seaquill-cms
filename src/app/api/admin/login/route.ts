import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 login attempts per 15 minutes per IP
    const ip = getClientIp(request.headers);
    const rl = rateLimit(ip, { prefix: "login", limit: 5, windowSeconds: 900 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan login. Coba lagi nanti." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    await createSession({ id: user.id, email: user.email, name: user.name, role: user.role });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}
