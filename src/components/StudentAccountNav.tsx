"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function StudentAccountNav() {
  const [name, setName] = useState<string | null>(null); const router = useRouter();
  useEffect(() => { fetch("/api/auth/me", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(j => setName(j?.student?.nama || null)).catch(() => null); }, []);
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); setName(null); router.push("/"); router.refresh(); }
  return name ? <div className="account-nav"><span>👤 {name}</span><button onClick={logout}>Keluar</button></div> : <div className="account-nav"><Link href="/masuk">Masuk</Link><Link className="account-signup" href="/daftar">Daftar</Link></div>;
}
