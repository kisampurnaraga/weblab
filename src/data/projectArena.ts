export type ProjectWorkspace = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  concepts: string[];
  rewardXp: number;
  missions: string[];
  starterCode: string;
};

export const projectWorkspaces: Record<string, ProjectWorkspace> = {
  "obby-logic": {
    id: "obby-logic",
    icon: "🧱",
    title: "Obby Logic",
    subtitle: "Roblox-inspired obstacle logic",
    description: "Bangun simulasi obstacle course berbasis terminal: nyawa, checkpoint, level, dan skor.",
    concepts: ["if", "loop", "function"],
    rewardXp: 180,
    missions: [
      "Buat variabel nyawa, level, checkpoint, dan skor.",
      "Gunakan if/else untuk menentukan apakah pemain lolos rintangan.",
      "Gunakan loop untuk menjalankan minimal 5 rintangan.",
      "Buat fungsi finish_level() yang menampilkan skor akhir.",
    ],
    starterCode: `# 🧱 OBBY LOGIC — webLab Project Arena\n\nnyawa = 3\ncheckpoint = 0\nskor = 0\n\nrintangan = [\"Lava Jump\", \"Moving Wall\", \"Laser Door\", \"Dark Bridge\", \"Final Tower\"]\n\nprint(\"=== OBBY LOGIC ===\")\n\n# TODO 1: loop semua rintangan\n# TODO 2: minta pemain memilih aksi: lompat / tunggu\n# TODO 3: gunakan if/else untuk menentukan lolos atau gagal\n# TODO 4: update checkpoint, nyawa, dan skor\n\nprint(\"Nyawa:\", nyawa)\nprint(\"Checkpoint:\", checkpoint)\nprint(\"Skor:\", skor)`,
  },
  "mini-tycoon": {
    id: "mini-tycoon",
    icon: "🏪",
    title: "Mini Tycoon",
    subtitle: "Business simulator",
    description: "Bangun usaha virtual dengan modal, pemasukan harian, upgrade toko, target keuntungan, dan level bisnis.",
    concepts: ["variable", "loop", "dictionary", "function"],
    rewardXp: 220,
    missions: [
      "Kelola modal awal Rp100.000 dan saldo usaha.",
      "Simulasikan 7 hari penjualan menggunakan loop.",
      "Tambahkan minimal 3 upgrade toko dengan dictionary.",
      "Buat fungsi laporan_harian() dan tentukan apakah target laba tercapai.",
    ],
    starterCode: `# 🏪 MINI TYCOON — webLab Project Arena\n\nmodal = 100_000\nsaldo = modal\nlevel_toko = 1\ntarget_laba = 250_000\n\nupgrade = {\n    \"etalase\": 25_000,\n    \"iklan\": 40_000,\n    \"kasir_otomatis\": 75_000,\n}\n\ndef laporan_harian(hari, pemasukan, pengeluaran):\n    global saldo\n    # TODO: hitung perubahan saldo\n    pass\n\nprint(\"=== MINI TYCOON ===\")\nprint(\"Modal awal: Rp\", modal)\n\nfor hari in range(1, 8):\n    print(\"\\nHari ke-\", hari)\n    # TODO 1: tentukan pemasukan harian\n    # TODO 2: tentukan biaya operasional\n    # TODO 3: panggil laporan_harian()\n    # TODO 4: buat sistem upgrade ketika saldo cukup\n\nprint(\"\\nSaldo akhir: Rp\", saldo)\n# TODO 5: cek apakah target laba tercapai`,
  },
  "pet-care": {
    id: "pet-care",
    icon: "🐾",
    title: "Pet Care Simulator",
    subtitle: "Cozy virtual pet",
    description: "Rawat hewan virtual dengan status lapar, energi, kebahagiaan, kesehatan, dan item.",
    concepts: ["class", "state", "function"],
    rewardXp: 220,
    missions: [
      "Buat class Pet dengan nama, lapar, energi, dan bahagia.",
      "Tambahkan method makan(), tidur(), dan bermain().",
      "Pastikan nilai status tidak melebihi 100 atau kurang dari 0.",
      "Buat loop aktivitas harian dan tampilkan status akhir pet.",
    ],
    starterCode: `# 🐾 PET CARE SIMULATOR — webLab Project Arena\n\nclass Pet:\n    def __init__(self, nama):\n        self.nama = nama\n        self.lapar = 50\n        self.energi = 70\n        self.bahagia = 60\n\n    def status(self):\n        print(f\"{self.nama} | lapar={self.lapar} energi={self.energi} bahagia={self.bahagia}\")\n\n    # TODO: buat method makan(), tidur(), bermain()\n\npet = Pet(\"Mochi\")\npet.status()\n\n# TODO: jalankan beberapa aktivitas dan tampilkan perubahan status`,
  },
  "fashion-shop": {
    id: "fashion-shop",
    icon: "👗",
    title: "Fashion Shop Challenge",
    subtitle: "Creative store game",
    description: "Kelola butik digital: stok outfit, harga, rating pelanggan, budget, dan target penjualan.",
    concepts: ["list", "dictionary", "scoring"],
    rewardXp: 200,
    missions: [
      "Buat katalog minimal 5 outfit dengan nama, harga, dan stok.",
      "Buat fungsi beli_outfit() yang mengurangi stok dan budget.",
      "Hitung rating pelanggan berdasarkan pilihan outfit.",
      "Tampilkan laporan penjualan dan outfit terlaris.",
    ],
    starterCode: `# 👗 FASHION SHOP CHALLENGE — webLab Project Arena\n\nkatalog = [\n    {\"nama\": \"Pastel Hoodie\", \"harga\": 45000, \"stok\": 4},\n    {\"nama\": \"Denim Set\", \"harga\": 65000, \"stok\": 3},\n    {\"nama\": \"Sporty Look\", \"harga\": 55000, \"stok\": 5},\n]\n\nbudget = 200_000\npenjualan = 0\n\ndef tampilkan_katalog():\n    for i, item in enumerate(katalog, start=1):\n        print(i, item[\"nama\"], \"Rp\", item[\"harga\"], \"stok\", item[\"stok\"])\n\n# TODO: buat beli_outfit()\n# TODO: tambah sistem rating dan outfit terlaris\n\ntampilkan_katalog()`,
  },
  "escape-quiz": {
    id: "escape-quiz",
    icon: "🧩",
    title: "Escape Quiz",
    subtitle: "Puzzle & debugging",
    description: "Pemain harus menjawab soal dan memperbaiki bug untuk membuka pintu level berikutnya.",
    concepts: ["quiz", "condition", "debugging"],
    rewardXp: 190,
    missions: [
      "Buat minimal 5 pertanyaan dengan jawaban benar.",
      "Gunakan if/else untuk membuka atau mengunci pintu.",
      "Tambahkan satu level khusus debugging kode.",
      "Hitung skor dan tentukan ending berdasarkan hasil pemain.",
    ],
    starterCode: `# 🧩 ESCAPE QUIZ — webLab Project Arena\n\npertanyaan = [\n    {\"soal\": \"Apa hasil 3 ** 2?\", \"jawab\": \"9\"},\n    {\"soal\": \"Keyword kondisi Python?\", \"jawab\": \"if\"},\n]\n\nskor = 0\nlevel = 1\n\nprint(\"=== ESCAPE QUIZ ===\")\n\nfor q in pertanyaan:\n    print(\"Level\", level)\n    # TODO: gunakan input() untuk membaca jawaban pemain\n    # TODO: cek jawaban dan update skor\n    level += 1\n\n# TODO: buat ending berdasarkan skor\nprint(\"Skor akhir:\", skor)`,
  },
  "school-life": {
    id: "school-life",
    icon: "🏫",
    title: "School Life Simulator",
    subtitle: "Roleplay system",
    description: "Simulasikan jadwal, nilai, uang saku, misi, energi, dan keputusan karakter siswa.",
    concepts: ["data structure", "function", "OOP"],
    rewardXp: 230,
    missions: [
      "Buat karakter siswa dengan energi, uang saku, dan nilai.",
      "Buat jadwal 5 hari menggunakan dictionary/list.",
      "Tambahkan keputusan harian: belajar, istirahat, organisasi, atau jajan.",
      "Tampilkan ending berbeda berdasarkan nilai, energi, dan uang akhir.",
    ],
    starterCode: `# 🏫 SCHOOL LIFE SIMULATOR — webLab Project Arena\n\nsiswa = {\n    \"nama\": \"Alya\",\n    \"energi\": 80,\n    \"uang\": 50000,\n    \"nilai\": 75,\n}\n\njadwal = {\n    \"Senin\": [\"Python\", \"Matematika\"],\n    \"Selasa\": [\"Bahasa Indonesia\", \"Python\"],\n    \"Rabu\": [\"PAI\", \"Olahraga\"],\n}\n\nprint(\"=== SCHOOL LIFE SIMULATOR ===\")\nprint(\"Karakter:\", siswa[\"nama\"])\n\n# TODO: buat fungsi belajar(), istirahat(), dan jajan()\n# TODO: loop beberapa hari dan beri pilihan aktivitas\n# TODO: buat ending berdasarkan nilai, energi, dan uang\n\nprint(siswa)`,
  },
};

export const projectIds = Object.keys(projectWorkspaces);
