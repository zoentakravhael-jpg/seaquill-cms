import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const files = await prisma.mediaFile.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json({ error: "Gagal memuat media" }, { status: 500 });
  }
}
