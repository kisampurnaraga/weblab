export type PythonPedagogy = {
  hook: string;
  analogy: string;
  whyItMatters: string;
  visual: { title: string; items: string[]; flow?: boolean };
  steps: string[];
  checks: { question: string; answer: string }[];
  projectBrief: string;
  successCriteria: string[];
  challenge: string;
};

const P = (hook:string, analogy:string, whyItMatters:string, title:string, items:string[], steps:string[], checks:{question:string;answer:string}[], projectBrief:string, successCriteria:string[], challenge:string, flow=false):PythonPedagogy => ({hook,analogy,whyItMatters,visual:{title,items,flow},steps,checks,projectBrief,successCriteria,challenge});

export const pythonPedagogy: Record<string, PythonPedagogy> = {
  "01-kenalan-python": P(
    "Bayangkan kamu memberi instruksi kepada robot yang hanya melakukan apa yang ditulis, persis urutannya.",
    "Program seperti resep: setiap baris adalah langkah, dan Python adalah juru masak yang membaca resep itu.",
    "Semua materi berikutnya bergantung pada kemampuan membaca instruksi dan mengamati output.",
    "Alur program pertama", ["Kode Python", "Interpreter", "Output"],
    ["Baca satu baris kode dari kiri ke kanan.","Kenali fungsi print().","Prediksi apa yang muncul sebelum menekan Run.","Bandingkan prediksi dengan output."],
    [{question:"Apa tugas print()?",answer:"Menampilkan nilai atau teks ke output."},{question:"Apakah teks di dalam tanda kutip dihitung sebagai perintah Python?",answer:"Tidak, itu data string yang akan ditampilkan."}],
    "Buat Kartu Profil Terminal yang menampilkan nama, kelas, sekolah, dan cita-cita pada baris berbeda.",
    ["Minimal 4 baris output.","Menggunakan print() pada setiap informasi.","Tidak ada SyntaxError."],
    "Tambahkan garis pemisah dan satu kalimat motivasi agar output terlihat seperti kartu profil.", true),

  "02-variabel": P(
    "Aplikasi selalu perlu mengingat data: nama pengguna, skor game, harga, atau level.",
    "Variabel seperti kotak berlabel. Labelnya nama variabel, isi kotaknya adalah nilainya.",
    "Tanpa variabel, program sulit menggunakan kembali dan memperbarui data.",
    "Variabel menyimpan nilai", ["nama", "kelas", "cita_cita"],
    ["Buat nama variabel yang jelas.","Gunakan = untuk menyimpan nilai.","Gunakan # untuk catatan programmer.","Panggil nama variabel saat ingin memakai nilainya."],
    [{question:"Apa beda nama dan \"nama\"?",answer:"nama adalah variabel; \"nama\" adalah string literal."},{question:"Apa arti = dalam Python?",answer:"Assignment atau menyimpan nilai ke variabel."}],
    "Buat Biodata Digital memakai minimal lima variabel lalu tampilkan dengan label yang jelas.",
    ["Ada variabel nama, kelas, sekolah, hobi, cita_cita.","Semua variabel digunakan di output.","Nama variabel tidak memakai spasi."],
    "Tambahkan variabel target_belajar dan tampilkan dalam satu kalimat.", false),

  "03-input": P(
    "Program terasa hidup ketika dapat menerima jawaban dari pengguna.",
    "input() seperti petugas yang bertanya, lalu menyimpan jawaban pengguna ke formulir.",
    "Input adalah dasar form, chatbot, game, login, dan hampir semua aplikasi interaktif.",
    "Interaksi pengguna", ["Pertanyaan", "input()", "Variabel", "Output"],
    ["Tulis prompt yang jelas.","Simpan hasil input ke variabel.","Ingat: hasil input() selalu string.","Gunakan hasilnya di print()."],
    [{question:"Apa tipe hasil input()?",answer:"String, sebelum dikonversi."},{question:"Kenapa hasil input perlu disimpan?",answer:"Agar bisa digunakan lagi dalam proses berikutnya."}],
    "Buat Program Perkenalan yang meminta nama, sekolah, kelas, dan cita-cita lalu merangkum jawabannya.",
    ["Minimal 4 input().","Setiap input disimpan ke variabel.","Ada ringkasan output setelah input selesai."],
    "Buat kalimat penutup yang memanggil nama pengguna secara personal.", true),

  "04-tipe-data": P(
    "Komputer memperlakukan teks '17' berbeda dengan angka 17.",
    "Tipe data seperti jenis isi kotak: tulisan, bilangan bulat, desimal, atau sakelar benar/salah.",
    "Kesalahan tipe adalah salah satu penyebab error paling umum pada program pemula.",
    "Empat tipe dasar", ["str → teks", "int → bulat", "float → desimal", "bool → True/False"],
    ["Kenali nilai yang sedang dipakai.","Gunakan type() saat ragu.","Konversi input dengan int()/float() jika akan dihitung.","Jangan mencampur string dan angka tanpa konversi."],
    [{question:"Mengapa input umur tidak bisa langsung + 1?",answer:"Karena input() menghasilkan string."},{question:"Kapan memakai float?",answer:"Saat nilai memiliki bagian desimal."}],
    "Buat kalkulator Umur Tahun Depan dari input pengguna.",
    ["Umur dibaca dengan input().","Umur dikonversi ke int.","Output menampilkan umur + 1 tanpa TypeError."],
    "Tambahkan perkiraan umur lima tahun lagi.", false),

  "05-operator": P(
    "Kasir, game economy, nilai sekolah, dan kalkulator semuanya bekerja dengan operasi matematika.",
    "Operator adalah tombol kalkulator yang ditulis di dalam kode.",
    "Operator memungkinkan program mengubah data mentah menjadi informasi yang berguna.",
    "Input → Proses → Output", ["harga × jumlah", "subtotal", "diskon", "total"],
    ["Ambil data angka.","Hitung subtotal.","Hitung diskon dari subtotal.","Kurangi diskon untuk mendapatkan total.","Tampilkan hasil dengan label."],
    [{question:"Apa fungsi %?",answer:"Menghasilkan sisa pembagian."},{question:"Apa fungsi **?",answer:"Pangkat."}],
    "Buat Kasir Sederhana yang menghitung subtotal, diskon 10%, dan total bayar.",
    ["Menggunakan harga dan jumlah.","Subtotal = harga * jumlah.","Diskon = 10% subtotal.","Total akhir ditampilkan."],
    "Tambahkan uang_bayar dan hitung kembalian.", true),

  "06-boolean-perbandingan": P("Banyak keputusan program dimulai dari pertanyaan ya/tidak.","Boolean seperti lampu: hanya ON (True) atau OFF (False).","Login, kelulusan, filter, dan aturan game memakai boolean.","Kondisi menjadi boolean",["nilai >= 75","hadir >= 80","and","True / False"],["Tulis kondisi sederhana.","Lihat hasil True/False.","Gabungkan syarat dengan and/or.","Gunakan not untuk membalik kondisi."],[{question:"Kapan and bernilai True?",answer:"Ketika semua kondisi True."},{question:"Kapan or bernilai True?",answer:"Ketika minimal satu kondisi True."}],"Buat pengecekan syarat kelulusan dari nilai dan persentase kehadiran.",["Memakai >= pada dua syarat.","Menggabungkan kondisi dengan and.","Mencetak hasil boolean atau pesan yang sesuai."],"Tambahkan syarat tugas_selesai = True.",true),
  "07-if": P("Program harus bisa mengambil keputusan, bukan hanya menjalankan semua baris.","if seperti satpam: hanya mengizinkan blok kode lewat ketika syarat terpenuhi.","Percabangan adalah dasar game rules, validasi, dan business logic.","Kondisi → keputusan",["if kondisi:","indentasi","aksi"],["Tentukan kondisi.","Akhiri if dengan titik dua.","Indentasi isi blok.","Uji kondisi True dan False."],[{question:"Mengapa indentasi penting?",answer:"Python memakainya untuk menentukan blok kode."}],"Buat Cek Kelulusan yang menampilkan 'Lulus' hanya jika nilai minimal 75.",["Menggunakan if.","Ada kondisi nilai >= 75.","Isi blok terindentasi benar."],"Tambahkan pesan penghargaan jika nilai >= 90.",true),
  "08-if-else-elif": P("Satu kondisi sering tidak cukup: nilai bisa A, B, C, atau D.","elif seperti beberapa pintu pemeriksaan yang diuji berurutan.","Aplikasi nyata memiliki banyak jalur keputusan.","Percabangan multi-jalur",["if","elif","elif","else"],["Urutkan syarat dari yang paling ketat/tinggi.","Gunakan elif untuk alternatif.","Gunakan else sebagai fallback.","Uji nilai pada batas seperti 75, 80, 90."],[{question:"Mengapa grade harus dicek dari nilai tertinggi?",answer:"Agar kondisi yang lebih umum tidak menangkap nilai lebih dulu."}],"Buat Sistem Grade A/B/C/D dari nilai pengguna.",["Menggunakan if/elif/else.","Rentang grade tidak tumpang tindih secara salah.","Semua nilai mendapat output."],"Tambahkan validasi jika nilai di luar 0–100.",true),
  "09-for-range": P("Mengulang kode manual 10 kali adalah tanda kita membutuhkan loop.","for seperti mesin fotokopi: pola sama diulang untuk setiap item.","Loop menghemat kode dan mengolah banyak data secara konsisten.","Iterasi terkontrol",["range()","i = 1","i = 2","..."],["Tentukan berapa kali mengulang.","Gunakan range(start, stop).","Gunakan variabel loop di perhitungan.","Periksa bahwa stop tidak ikut."],[{question:"Apa isi range(1,4)?",answer:"1, 2, 3."}],"Buat tabel perkalian 1–10 untuk satu angka.",["Menggunakan for.","Menggunakan range(1, 11).","Output memuat 10 hasil perkalian."],"Buat format '7 x 3 = 21' dengan f-string.",true),
  "10-while": P("Kadang kita tidak tahu berapa kali loop harus berjalan.","while seperti game yang terus berjalan selama nyawa masih ada.","Loop berbasis kondisi dipakai pada menu, game loop, retry, dan proses berulang.","Loop selama kondisi benar",["kondisi True","jalankan","ubah kondisi","cek lagi"],["Siapkan nilai awal.","Tulis kondisi berhenti.","Pastikan nilai berubah setiap iterasi.","Gunakan break hanya jika memang perlu."],[{question:"Apa penyebab infinite loop?",answer:"Kondisi tidak pernah berubah menjadi False."}],"Buat hitung mundur 5 sampai 1 menggunakan while.",["Menggunakan while.","Angka berkurang setiap iterasi.","Program berhenti setelah 1."],"Setelah selesai, tampilkan 'Mulai!'.",true),
  "11-list": P("Aplikasi jarang menyimpan hanya satu data siswa atau satu barang.","List seperti rak dengan slot bernomor mulai dari 0.","List adalah fondasi pengelolaan koleksi data.","List dan index",["0: Ali","1: Budi","2: Citra"],["Buat list.","Tambah data dengan append().","Akses item lewat index.","Loop seluruh item."],[{question:"Index pertama?",answer:"0."}],"Buat daftar siswa, tambahkan minimal tiga nama, lalu tampilkan semuanya dengan loop.",["Menggunakan list.","Menggunakan append() atau list literal.","Menggunakan for untuk menampilkan semua siswa."],"Tambahkan fitur pencarian nama sederhana dengan operator in.",false),
  "12-dictionary": P("Data nyata punya label: nama, kelas, nilai, bukan sekadar posisi 0,1,2.","Dictionary seperti formulir: setiap field punya nama (key) dan isi (value).","Dictionary cocok untuk record siswa, produk, profil, dan data JSON.","Key → Value",["nama → Ahmad","kelas → XI","nilai → 90"],["Buat dictionary dengan {}.","Gunakan key yang bermakna.","Akses value lewat key.","Gabungkan dictionary dalam list untuk banyak record."],[{question:"Apa fungsi key?",answer:"Menamai dan mengakses value."}],"Buat dictionary nilai siswa dan hitung rata-ratanya.",["Minimal 3 pasangan mata pelajaran:nilai.","Mengakses nilai lewat key.","Menghitung dan mencetak rata-rata."],"Tambahkan key status_lulus berdasarkan rata-rata.",true),
  "13-function": P("Kode yang sama berulang sebaiknya dijadikan function.","Function seperti mesin: menerima bahan (parameter), memproses, lalu mengeluarkan hasil (return).","Function membuat program lebih pendek, teruji, dan mudah dirawat.","Parameter → Function → Return",["a,b,c","rata_rata()","hasil"],["Definisikan dengan def.","Beri parameter seperlunya.","Kerjakan satu tanggung jawab.","Gunakan return untuk hasil yang akan dipakai lagi."],[{question:"Apa beda print dan return?",answer:"print menampilkan; return mengembalikan nilai ke pemanggil."}],"Buat function rata_rata(a,b,c) dan uji dengan beberapa nilai.",["Ada def rata_rata.","Menggunakan parameter.","Menggunakan return.","Function dipanggil dan hasilnya ditampilkan."],"Buat function cek_kelulusan(rata) yang mengembalikan boolean.",true),
  "14-debugging": P("Programmer profesional tidak menghindari error; mereka membaca error dengan sistematis.","Error message seperti petunjuk lokasi kerusakan pada peta.","Debugging adalah skill inti yang lebih penting daripada menghafal sintaks.","Siklus debugging",["Run","Baca error","Cari baris","Perbaiki kecil","Run lagi"],["Baca jenis error.","Cari baris yang disebut.","Periksa tipe/nama/sintaks.","Ubah satu hal.","Jalankan ulang."],[{question:"Apa yang harus dibaca pertama dari traceback?",answer:"Jenis error dan baris yang terkait."}],"Perbaiki program umur tahun depan yang mengalami TypeError.",["Menemukan sumber error.","Mengonversi input ke int.","Program berjalan tanpa exception."],"Buat sendiri satu bug kecil lalu jelaskan penyebab dan perbaikannya.",true),
  "15-try-except": P("Input pengguna tidak selalu sesuai harapan.","try/except seperti jaring pengaman: program mencoba, lalu menangani kegagalan dengan elegan.","Error handling membuat aplikasi tidak mudah crash.","Jalur aman",["try","operasi berisiko","except","pesan ramah"],["Tempatkan operasi berisiko di try.","Tangkap exception spesifik.","Berikan pesan yang membantu.","Jangan menyembunyikan semua error tanpa alasan."],[{question:"Mengapa exception spesifik lebih baik?",answer:"Agar kita menangani penyebab yang benar tanpa menutupi bug lain."}],"Buat kalkulator pembagian yang aman dari input bukan angka dan pembagian nol.",["Menggunakan try/except.","Menangani ValueError.","Menangani ZeroDivisionError.","Program tidak crash pada input salah."],"Tambahkan loop agar pengguna bisa mencoba lagi.",true),
  "16-file-json": P("Aplikasi perlu menyimpan data agar tidak hilang saat program selesai.","File seperti buku catatan; JSON seperti format catatan terstruktur yang dipahami banyak sistem.","File dan JSON menjembatani program dengan penyimpanan dan API.","Data ↔ JSON",["dict/list","json.dumps","teks JSON","json.loads"],["Buat struktur data Python.","Ubah ke JSON.","Simpan/baca teks.","Konversi kembali ke object Python."],[{question:"Apa hubungan dictionary dan JSON object?",answer:"Strukturnya mirip key-value dan mudah dikonversi."}],"Buat profil siswa dalam dictionary lalu ubah menjadi JSON dan tampilkan.",["Menggunakan import json.","Memiliki dictionary profil.","Menggunakan json.dumps atau dump.","Output JSON valid."],"Tambahkan list skill ke profil.",true),
  "17-oop": P("Saat program membesar, data dan perilaku yang berkaitan perlu dikelompokkan.","Class adalah cetakan; object adalah benda yang dibuat dari cetakan itu.","OOP membantu memodelkan siswa, produk, akun, kendaraan, dan entitas aplikasi.","Class → Object",["class Siswa","nama/nilai","method","object Ahmad"],["Definisikan class.","Gunakan __init__ untuk property.","Tambahkan method sederhana.","Buat object dan panggil method."],[{question:"Apa beda class dan object?",answer:"Class adalah blueprint; object adalah instance nyata dari blueprint."}],"Buat class Siswa dengan nama, nilai, dan method status_lulus().",["Ada class.","Ada __init__.","Ada minimal dua property.","Ada method yang dipanggil dari object."],"Buat dua object siswa dan bandingkan statusnya.",true),
  "18-http-api": P("Frontend modern sering meminta data dari backend melalui API.","API seperti pelayan restoran: frontend memesan, backend memproses, lalu mengirim response.","Memahami request/response adalah fondasi backend dan full-stack.","Siklus HTTP",["Browser","Request","Backend","Response JSON"],["Kenali client dan server.","Bedakan GET/POST/PUT/DELETE.","Pahami status code dasar.","Pahami JSON sebagai payload."],[{question:"GET biasanya untuk apa?",answer:"Mengambil data."}],"Buat simulasi dictionary request dan response untuk endpoint siswa.",["Menjelaskan method GET.","Menyertakan path endpoint.","Response berbentuk data terstruktur."],"Tambahkan contoh POST dengan body nama siswa.",true),
  "19-fastapi": P("Sekarang logika Python dapat menjadi layanan yang dipanggil aplikasi lain.","Route FastAPI seperti loket dengan alamat URL dan tugas tertentu.","FastAPI mengubah pengetahuan Python menjadi backend web nyata.","Request → Route → Response",["GET /","function","dict","JSON response"],["Import FastAPI.","Buat app.","Buat decorator route.","Kembalikan dictionary.","Uji lewat docs."],[{question:"Apa fungsi @app.get('/')?",answer:"Mendaftarkan function sebagai handler GET pada path /."}],"Buat API sederhana dengan route / dan /students.",["Membuat FastAPI app.","Minimal dua GET route.","Mengembalikan dictionary/list."],"Tambahkan path parameter /students/{id}.",true),
  "20-rest-crud-db": P("Backend yang berguna harus bisa membuat, membaca, mengubah, dan menghapus data.","CRUD seperti administrasi data: tambah, lihat, koreksi, hapus.","CRUD + database adalah fondasi sistem sekolah, toko, dan aplikasi bisnis.","REST CRUD",["POST Create","GET Read","PUT Update","DELETE Delete"],["Tentukan model data.","Petakan method ke CRUD.","Validasi input.","Simpan data.","Kembalikan status yang jelas."],[{question:"Method untuk update?",answer:"PUT/PATCH, tergantung desain API."}],"Rancang Student REST API dengan endpoint GET, POST, PUT, DELETE.",["Ada daftar endpoint CRUD.","Ada struktur student_id/nama/kelas.","Ada validasi dasar.","Menjelaskan penyimpanan database."],"Tambahkan endpoint statistik jumlah siswa per kelas.",true)
};

export type PythonExerciseRule = { required: RegExp[]; output?: RegExp; minCodeLength?: number };

export const pythonExerciseRules: Record<string, PythonExerciseRule> = {
  "01-kenalan-python": { required: [/print\s*\(/, /nama/i, /kelas/i], minCodeLength: 35 },
  "02-variabel": { required: [/nama\s*=/, /kelas\s*=/, /print\s*\(/], minCodeLength: 50 },
  "03-input": { required: [/input\s*\(/, /nama\s*=/, /print\s*\(/], minCodeLength: 55 },
  "04-tipe-data": { required: [/input\s*\(/, /int\s*\(/, /\+\s*1/], minCodeLength: 45 },
  "05-operator": { required: [/harga/, /jumlah/, /\*/, /diskon/i, /total/i], minCodeLength: 70 },
  "06-boolean-perbandingan": { required: [/>=/, /and/, /nilai/i, /hadir/i], minCodeLength: 35 },
  "07-if": { required: [/if\s+/, />=\s*75/, /print\s*\(/], minCodeLength: 30 },
  "08-if-else-elif": { required: [/if\s+/, /elif\s+/, /else\s*:/], minCodeLength: 60 },
  "09-for-range": { required: [/for\s+\w+\s+in\s+range/, /range\s*\(\s*1\s*,\s*11\s*\)/, /\*/], minCodeLength: 45 },
  "10-while": { required: [/while\s+/, /-=\s*1|=\s*\w+\s*-\s*1/, /print\s*\(/], minCodeLength: 40 },
  "11-list": { required: [/\[/, /append\s*\(|for\s+\w+\s+in/], minCodeLength: 45 },
  "12-dictionary": { required: [/\{[^}]*:/, /rata|average|sum|\+/i], minCodeLength: 55 },
  "13-function": { required: [/def\s+rata_rata\s*\(/, /return\s+/], minCodeLength: 45 },
  "14-debugging": { required: [/int\s*\(.*input|int\s*\(\s*umur\s*\)/], minCodeLength: 30 },
  "15-try-except": { required: [/try\s*:/, /except\s+/, /ZeroDivisionError|ValueError/], minCodeLength: 65 },
  "16-file-json": { required: [/import\s+json/, /json\.dumps|json\.dump/], minCodeLength: 60 },
  "17-oop": { required: [/class\s+Siswa/, /def\s+__init__/, /self\./], minCodeLength: 90 },
  "18-http-api": { required: [/GET/i, /response|request/i], minCodeLength: 45 },
  "19-fastapi": { required: [/FastAPI/, /@app\.get/, /def\s+|async\s+def/], minCodeLength: 80 },
  "20-rest-crud-db": { required: [/GET/i, /POST/i, /PUT|PATCH/i, /DELETE/i], minCodeLength: 80 }
};

export function validatePythonExercise(moduleSlug:string, code:string, output:string){
  const rule = pythonExerciseRules[moduleSlug];
  if (!rule) return { ok:false, message:"Validator latihan belum tersedia." };
  if ((code || "").trim().length < (rule.minCodeLength || 1)) return { ok:false, message:"Kode masih terlalu singkat. Lengkapi requirement tugas terlebih dahulu." };
  const missing = rule.required.find(r => !r.test(code));
  if (missing) return { ok:false, message:"Masih ada requirement tugas yang belum terlihat di kode. Periksa kembali indikator berhasil." };
  if (rule.output && !rule.output.test(output || "")) return { ok:false, message:"Output belum sesuai target latihan." };
  if (/Traceback|Error:|SyntaxError|TypeError|NameError|ValueError/.test(output || "")) return { ok:false, message:"Program masih menghasilkan error. Perbaiki dahulu lalu jalankan kembali." };
  return { ok:true, message:"Latihan memenuhi requirement utama." };
}
