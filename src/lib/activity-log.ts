import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function logActivity(
  action: string,
  entity: string,
  entityId?: number,
  entityName?: string,
  details?: string
) {
  const session = await getSession();
  if (!session) return;

  try {
    await prisma.activityLog.create({
      data: {
        action,
        entity,
        entityId: entityId ?? null,
        entityName: entityName ?? "",
        details: details ?? "",
        userId: session.userId,
      },
    });
  } catch {
    // Silently fail if FK violation (e.g. stale session with deleted user)
  }
}
