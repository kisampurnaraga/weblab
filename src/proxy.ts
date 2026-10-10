import { NextRequest, NextResponse } from "next/server";
async function validSession(token?: string) {
  if (!token || !process.env.WEBLAB_SESSION_SECRET) return false;
  try { const [payload,sig]=token.split("."); if(!payload||!sig) return false; const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(process.env.WEBLAB_SESSION_SECRET),{name:"HMAC",hash:"SHA-256"},false,["sign"]); const raw=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(payload)); const expected=Buffer.from(raw).toString("base64url"); if(expected!==sig) return false; const data=JSON.parse(Buffer.from(payload,"base64url").toString("utf8")); return Number(data.exp)>Date.now(); } catch { return false; }
}
export async function proxy(request: NextRequest) { if(await validSession(request.cookies.get("weblab_session")?.value)) return NextResponse.next(); const url=new URL("/masuk",request.url); url.searchParams.set("next",request.nextUrl.pathname); return NextResponse.redirect(url); }
export const config={ matcher:["/belajar/:path*","/playground/:path*","/progress/:path*"] };
