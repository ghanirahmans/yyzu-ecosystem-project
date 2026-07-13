import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  // Verify that the request is authorized by Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Perform a lightweight raw SQL query to keep the database active
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      success: true,
      message: "Database pinged successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error("Cron database ping failed", { err: String(error) });
    return NextResponse.json(
      { success: false, error: error.message || "Failed to ping database" },
      { status: 500 }
    );
  }
}
