import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { repairPlaceholderImages } from "@/lib/seed-runtime";
import { seedAllTables } from "../../../../prisma/seed";

export async function GET(request: NextRequest) {
  try {
    const shouldRepair = request.nextUrl.searchParams.get("repair") === "1";
    const shouldForce = request.nextUrl.searchParams.get("force") === "1";

    const productCount = await prisma.productCategory.count();
    if (productCount > 0 && !shouldForce) {
      if (shouldRepair) {
        const result = await repairPlaceholderImages(prisma);
        return NextResponse.json({
          message: "Image repair completed",
          status: "repaired",
          ...result,
        });
      }

      return NextResponse.json({
        message: "Database already initialized",
        status: "ok",
      });
    }

    console.log("[INIT-DB] Running seed (force=" + shouldForce + ")...");
    await seedAllTables();

    return NextResponse.json({
      message: "Database initialized successfully!",
      status: "initialized",
    });
  } catch (error) {
    console.error("[INIT-DB] Error initializing database:", error);
    return NextResponse.json(
      { error: "Failed to initialize database", details: String(error) },
      { status: 500 }
    );
  }
}
