import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Perform a lightweight database query to keep the connection alive
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      message: "Database connection is active"
    });
  } catch (error: any) {
    console.error("Public Database Ping Failed:", error);
    return NextResponse.json(
      { status: "unhealthy", error: "Database connection failed" },
      { status: 500 }
    );
  }
}
