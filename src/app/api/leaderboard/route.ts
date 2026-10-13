import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { studentRepository } from "@/lib/server/sheets";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await studentRepository.getLeaderboard(session.studentId));
  } catch (error) {
    return NextResponse.json({
      top: [],
      me: null,
      error: error instanceof Error ? error.message : "Leaderboard belum tersedia",
    });
  }
}
