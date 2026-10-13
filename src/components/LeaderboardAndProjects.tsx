"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { readProgress, selectProject } from "@/lib/progress";

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

type ProjectChoice = {
  id: string;
  icon: string;
  title: string;
  type: string;
  description: string;
  skills: string;
};

const rewards = [
  { rank: 1, medal: "🥇", title: "Python Champion", reward: "Badge Gold + 300 bonus XP" },
  { rank: 2, medal: "🥈", title: "Code Runner", reward: "Badge Silver + 200 bonus XP" },
  { rank: 3, medal: "🥉", title: "Logic Star", reward: "Badge Bronze + 100 bonus XP" },
];

const projectChoices: ProjectChoice[] = [
  {
    id: "obby-logic",
    icon: "🧱",
    title: "Obby Logic",
    type: "Roblox-inspired",
    description: "Buat obstacle course berbasis logika: nyawa, checkpoint, level, dan skor.",
    skills: "if · loop · function",
  },
  {
    id: "mini-tycoon",
    icon: "🏪",
    title: "Mini Tycoon",
    type: "Simulator",
    description: "Bangun usaha virtual: modal, pemasukan, upgrade, target, dan leaderboard.",
    skills: "variable · loop · dictionary",
  },
  {
    id: "pet-care",
    icon: "🐾",
    title: "Pet Care Simulator",
    type: "Cozy game",
    description: "Rawat hewan virtual dengan level lapar, energi, happiness, dan item.",
    skills: "class · state · function",
  },
  {
    id: "fashion-shop",
    icon: "👗",
    title: "Fashion Shop Challenge",
    type: "Creative game",
    description: "Kelola butik, outfit, budget, rating pelanggan, dan target penjualan.",
    skills: "list · dictionary · scoring",
  },
  {
    id: "escape-quiz",
    icon: "🧩",
    title: "Escape Quiz",
    type: "Puzzle",
    description: "Pemain harus menjawab soal dan memperbaiki bug untuk membuka level berikutnya.",
    skills: "quiz · condition · debugging",
  },
  {
    id: "school-life",
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
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [savedProject, setSavedProject] = useState<string>("");
  const [savingProject, setSavingProject] = useState(false);
  const [projectMessage, setProjectMessage] = useState("");

  useEffect(() => {
    fetch("/api/leaderboard", { cache: "no-store" })
      .then(r => r.ok ? r.json() : ({ top: [], me: null }))
      .then(setData)
      .catch(() => setData({ top: [], me: null }))
      .finally(() => setLoading(false));

    readProgress()
      .then(progress => {
        if (progress.selectedProject) {
          setSelectedProject(progress.selectedProject);
          setSavedProject(progress.selectedProject);
        }
      })
      .catch(() => undefined);
  }, []);

  const podium = data.top.slice(0, 3);
  const activeProject = useMemo(
    () => projectChoices.find(project => project.id === selectedProject) || null,
    [selectedProject]
  );

  async function saveProject() {
    if (!selectedProject) return;
    setSavingProject(true);
    setProjectMessage("");
    try {
      const progress = await selectProject(selectedProject);
      setSavedProject(progress.selectedProject || selectedProject);
      setProjectMessage("Project tersimpan ke akun kamu. Siap mulai!");
    } catch {
      setProjectMessage("Pilihan belum berhasil disimpan. Coba lagi.");
    } finally {
      setSavingProject(false);
    }
  }

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
        {!loading && podium.length === 0 && <div className="leaderboard-empty">Leaderboard siap. Setelah siswa mengumpulkan XP, ranking akan tampil di sini.</div>}
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
          <p>Klik salah satu kartu. Pilihanmu akan disimpan ke akun dan bisa diganti kapan saja.</p>
        </div>
        <Link href="/playground/python" className="btn ghost">Buka Playground</Link>
      </div>

      <div className="project-choice-grid">
        {projectChoices.map((project, index) => {
          const selected = selectedProject === project.id;
          const saved = savedProject === project.id;
          return <motion.button
            type="button"
            className={`project-choice-card project-choice-button ${selected ? "selected" : ""}`}
            key={project.id}
            aria-pressed={selected}
            onClick={() => {
              setSelectedProject(project.id);
              setProjectMessage("");
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.985 }}
          >
            <div className="project-choice-top">
              <span className="project-choice-icon">{project.icon}</span>
              <span className="badge success">{saved ? "Dipilih ✓" : project.type}</span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <small>{project.skills}</small>
            {selected && <span className="project-select-indicator">✓ Pilihan kamu</span>}
          </motion.button>;
        })}
      </div>

      <motion.div
        className={`project-selection-bar ${activeProject ? "active" : ""}`}
        initial={false}
        animate={{ opacity: activeProject ? 1 : 0.72, y: activeProject ? 0 : 4 }}
      >
        <div>
          <small>PROJECT PILIHAN</small>
          <strong>{activeProject ? `${activeProject.icon} ${activeProject.title}` : "Belum ada project dipilih"}</strong>
          <span>{activeProject ? activeProject.description : "Pilih salah satu kartu di atas untuk melanjutkan."}</span>
          {projectMessage && <em>{projectMessage}</em>}
        </div>
        <div className="project-selection-actions">
          <button
            className="btn primary"
            type="button"
            disabled={!activeProject || savingProject || savedProject === selectedProject}
            onClick={saveProject}
          >
            {savingProject ? "Menyimpan..." : savedProject === selectedProject && selectedProject ? "Tersimpan ✓" : "Pilih Project Ini"}
          </button>
          {savedProject === selectedProject && selectedProject && (
            <Link href={`/playground/python?project=${selectedProject}`} className="btn ghost">Mulai Project →</Link>
          )}
        </div>
      </motion.div>

      <div className="project-note">
        <strong>Catatan:</strong> project ini dibuat dengan Python dan UI webLab. Jika nanti ingin benar-benar publish ke Roblox Studio, kita buat track lanjutan <strong>Roblox Studio + Luau</strong> setelah dasar Python siswa kuat.
      </div>
    </motion.section>
  </>;
}
