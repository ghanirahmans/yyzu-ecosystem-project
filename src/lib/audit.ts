import { prisma } from "@/lib/prisma";

export async function createAuditLog(
  actorId: string | null,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: Record<string, string | number | boolean>
) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
