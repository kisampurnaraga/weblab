"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const register = mode === "register";
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch(`/api/auth/${register ? "register" : "login"}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json(); if (!res.ok) throw new Error(json.error || "Gagal memproses akun");
      router.push("/belajar/python"); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Terjadi kesalahan"); }
    finally { setLoading(false); }
  }
  return <div className="auth-wrap"><div className="auth-card"><Link href="/" className="brand auth-brand"><span className="brand-mark">w</span>webLab</Link><span className="eyebrow">Akun Siswa</span><h1>{register ? "Buat akun belajar" : "Masuk ke webLab"}</h1><p className="muted">Progress Python, quiz, dan XP akan tersimpan pada akunmu.</p><form onSubmit={submit} className="auth-form">{register && <><label>Nama lengkap<input name="nama" required minLength={3} autoComplete="name" /></label><label>Kelas<input name="kelas" required placeholder="Contoh: XI-A" /></label><label>Email <small>(opsional)</small><input name="email" type="email" autoComplete="email" /></label></>}<label>Username<input name="username" required minLength={4} pattern="[a-zA-Z0-9._-]+" autoComplete="username" /></label><label>Password<input name="password" required minLength={8} type="password" autoComplete={register ? "new-password" : "current-password"} /></label>{error && <div className="auth-error">{error}</div>}<button className="btn primary auth-submit" disabled={loading}>{loading ? "Memproses..." : register ? "Daftar & Mulai Belajar" : "Masuk"}</button></form><p className="auth-switch">{register ? "Sudah punya akun?" : "Belum punya akun?"} <Link href={register ? "/masuk" : "/daftar"}>{register ? "Masuk" : "Daftar sekarang"}</Link></p></div></div>;
}
