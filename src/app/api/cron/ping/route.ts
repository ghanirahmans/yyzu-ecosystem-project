import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  // Verify that the request is authorized by Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Perform a lightweight query to keep the database active
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: "Database pinged successfully",
      timestamp: new Date().toISOString(),
      userCount,
    });
  } catch (error: any) {
    console.error("Cron Database Ping Failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to ping database" },
      { status: 500 }
    );
  }
}
