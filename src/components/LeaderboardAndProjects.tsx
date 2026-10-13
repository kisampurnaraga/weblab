"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

type Entry = {
  rank: number;
  studentId: string;
  nama: string;
  username: string;
  kelas: string;
  xp: number;
  completedLessons: number;
  quizAverage: number;
};

type LeaderboardData = { top: Entry[]; me: Entry | null; error?: string };

const rewards = [
  { rank: 1, medal: "🥇", title: "Python Champion", reward: "Badge Gold + 300 bonus XP" },
  { rank: 2, medal: "🥈", title: "Code Runner", reward: "Badge Silver + 200 bonus XP" },
  { rank: 3, medal: "🥉", title: "Logic Star", reward: "Badge Bronze + 100 bonus XP" },
];

const projectChoices = [
  {
    icon: "🧱",
    title: "Obby Logic",
    type: "Roblox-inspired",
    description: "Buat obstacle course berbasis logika: nyawa, checkpoint, level, dan skor.",
    skills: "if · loop · function",
  },
  {
    icon: "🏪",
    title: "Mini Tycoon",
    type: "Simulator",
    description: "Bangun usaha virtual: modal, pemasukan, upgrade, target, dan leaderboard.",
    skills: "variable · loop · dictionary",
  },
  {
    icon: "🐾",
    title: "Pet Care Simulator",
    type: "Cozy game",
    description: "Rawat hewan virtual dengan level lapar, energi, happiness, dan item.",
    skills: "class · state · function",
  },
  {
    icon: "👗",
    title: "Fashion Shop Challenge",
    type: "Creative game",
    description: "Kelola butik, outfit, budget, rating pelanggan, dan target penjualan.",
    skills: "list · dictionary · scoring",
  },
  {
    icon: "🧩",
    title: "Escape Quiz",
    type: "Puzzle",
    description: "Pemain harus menjawab soal dan memperbaiki bug untuk membuka level berikutnya.",
    skills: "quiz · condition · debugging",
  },
  {
    icon: "🏫",
    title: "School Life Simulator",
    type: "Roleplay system",
    description: "Simulasikan jadwal, nilai, uang saku, misi, dan keputusan karakter siswa.",
    skills: "data structure · function · OOP",
  },
];

export default function LeaderboardAndProjects() {
  const [data, setData] = useState<LeaderboardData>({ top: [], me: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard", { cache: "no-store" })
      .then(r => r.ok ? r.json() : ({ top: [], me: null }))
      .then(setData)
      .catch(() => setData({ top: [], me: null }))
      .finally(() => setLoading(false));
  }, []);

  const podium = data.top.slice(0, 3);

  return <>
    <motion.section
      className="leaderboard-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
    >
      <div className="section-head leaderboard-head">
        <div>
          <span className="eyebrow">XP League</span>
          <h2>Top 3 Minggu Ini</h2>
          <p>XP adalah skor utama. Jika sama, ranking ditentukan dari lesson selesai lalu rata-rata quiz.</p>
        </div>
        {data.me && <div className="my-rank-chip">Rank kamu <strong>#{data.me.rank}</strong> · {data.me.xp} XP</div>}
      </div>

      <div className="podium-grid">
        {loading && [1,2,3].map(i => <div className="podium-card skeleton" key={i} />)}
        {!loading && podium.map((entry, index) => {
          const reward = rewards[index];
          return <motion.div
            className={`podium-card rank-${entry.rank}`}
            key={entry.studentId}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <span className="podium-medal">{reward?.medal}</span>
            <small>#{entry.rank}</small>
            <h3>{entry.nama}</h3>
            <p>{entry.kelas || "Siswa webLab"}</p>
            <strong>{entry.xp} XP</strong>
            <div className="podium-meta">{entry.completedLessons} lesson · quiz {entry.quizAverage}%</div>
            <span className="reward-badge">{reward?.title}</span>
            <small className="reward-copy">{reward?.reward}</small>
          </motion.div>;
        })}
        {!loading && podium.length === 0 && <div className="leaderboard-empty">Leaderboard siap. Setelah bridge Apps Script diperbarui, ranking siswa akan tampil di sini.</div>}
      </div>
    </motion.section>

    <motion.section
      className="project-arena"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
    >
      <div className="section-head">
        <div>
          <span className="eyebrow">Project Arena</span>
          <h2>Pilih game yang kamu suka</h2>
          <p>Setiap checkpoint project boleh memilih tema. Semua pilihan menguji konsep Python yang sama dengan gaya berbeda.</p>
        </div>
        <Link href="/playground/python" className="btn ghost">Buka Playground</Link>
      </div>

      <div className="project-choice-grid">
        {projectChoices.map((project, index) => <motion.article
          className="project-choice-card"
          key={project.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.04 }}
          whileHover={{ y: -5 }}
        >
          <div className="project-choice-top">
            <span className="project-choice-icon">{project.icon}</span>
            <span className="badge success">{project.type}</span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <small>{project.skills}</small>
        </motion.article>)}
      </div>

      <div className="project-note">
        <strong>Catatan:</strong> project ini dibuat dengan Python dan UI webLab. Jika nanti ingin benar-benar publish ke Roblox Studio, kita buat track lanjutan <strong>Roblox Studio + Luau</strong> setelah dasar Python siswa kuat.
      </div>
    </motion.section>
  </>;
}
