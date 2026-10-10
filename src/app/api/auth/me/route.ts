import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
export async function GET() { const session = await getSession(); return session ? NextResponse.json({ authenticated: true, student: session }) : NextResponse.json({ authenticated: false }, { status: 401 }); }
