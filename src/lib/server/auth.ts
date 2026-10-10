import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type StudentSession = { studentId: string; username: string; nama: string; exp: number };
const COOKIE = "weblab_session";

function secret() {
  const value = process.env.WEBLAB_SESSION_SECRET;
  if (!value) throw new Error("WEBLAB_SESSION_SECRET belum dikonfigurasi");
  return value;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function signSession(input: Omit<StudentSession, "exp">) {
  const payload: StudentSession = { ...input, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifySessionToken(token?: string | null): StudentSession | null {
  if (!token) return null;
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig) return null;
    const expected = createHmac("sha256", secret()).update(encoded).digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as StudentSession;
    if (!payload.studentId || payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE)?.value);
}

export async function setSession(session: Omit<StudentSession, "exp">) {
  const store = await cookies();
  store.set(COOKIE, signSession(session), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14 });
}

export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}
