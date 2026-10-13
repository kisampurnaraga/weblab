export type HtmlCssVisual = "document"|"link-image"|"table"|"form"|"selector"|"box-model"|"flex"|"grid"|"responsive"|"motion"|"component"|"portfolio";

export type ConceptPoint = { title: string; body: string };
export type WalkthroughStep = { title: string; body: string };
export type LessonProject = {
  title: string;
  brief: string;
  uses: string[];
  requirements: string[];
  successCriteria: string[];
  stretch?: string;
};

export type HtmlCssLesson = {
  slug: string;
  title: string;
  duration: string;
  objectives: string[];
  story: string;
  why: string;
  explanation: string[];
  concepts: ConceptPoint[];
  visual: HtmlCssVisual;
  walkthrough: WalkthroughStep[];
  html: string;
  css: string;
  checkpoint: { question: string; answer: string }[];
  project: LessonProject;
  hints: string[];
  quiz: { question: string; options: string[]; answer: number; explanation: string };
};

export type HtmlCssModule = {
  slug: string;
  order: number;
  stage: string;
  title: string;
  description: string;
  lessons: HtmlCssLesson[];
};

const lesson = (data: Omit<HtmlCssLesson,"duration">):HtmlCssLesson => ({...data,duration:"35–50 menit"});

export const htmlCssModules: HtmlCssModule[] = [
{
 slug:"01-html-dasar",order:1,stage:"HTML Fundamental",title:"HTML & Struktur Dokumen",description:"Memahami HTML sebagai struktur informasi, bukan sekadar menghafal tag.",lessons:[lesson({
  slug:"lesson-utama",title:"Membangun Kerangka Halaman Web",visual:"document",
  objectives:["Menjelaskan fungsi HTML dengan bahasa sendiri","Membedakan tag, elemen, dan atribut","Menyusun struktur halaman yang masuk akal"],
  story:"Bayangkan kamu diminta membuat profil kelas. Sebelum memikirkan warna, font, atau animasi, kamu harus menentukan dulu: mana judul utama, mana penjelasan, mana daftar informasi, dan bagaimana urutannya. Itulah pekerjaan HTML.",
  why:"Jika struktur HTML berantakan, CSS akan sulit dirawat, screen reader sulit memahami halaman, dan saat website membesar kamu akan kesulitan mencari bagian tertentu.",
  explanation:["HTML adalah bahasa markup untuk memberi makna dan struktur pada konten. Browser membaca markup lalu membentuk DOM, yaitu representasi pohon dari elemen-elemen halaman.","Sebuah elemen biasanya terdiri dari tag pembuka, isi, dan tag penutup. Contoh: <p>Halo</p>. Beberapa elemen seperti <img> tidak memiliki isi teks di dalamnya.","Gunakan elemen sesuai maknanya. <h1> untuk judul utama, <p> untuk paragraf, <main> untuk konten utama. Ini disebut semantic HTML."],
  concepts:[{title:"Tag",body:"Penanda seperti <h1> atau <p> yang memberi instruksi struktur kepada browser."},{title:"Elemen",body:"Tag beserta isi dan batasnya. <p>Halo</p> adalah satu elemen lengkap."},{title:"Atribut",body:"Informasi tambahan di tag pembuka, misalnya class, id, href, atau src."}],
  walkthrough:[{title:"1. Mulai dari struktur",body:"Buat <main> sebagai area konten utama."},{title:"2. Tentukan hierarchy",body:"Nama siswa adalah informasi terpenting, jadi gunakan <h1>."},{title:"3. Tambahkan detail",body:"Kelas, sekolah, dan cita-cita cocok menjadi paragraf atau list."},{title:"4. Cek makna",body:"Tanya: jika CSS dihapus, apakah isi halaman masih mudah dipahami?"}],
  html:`<main class="profile">\n  <h1>Alya Rahma</h1>\n  <p>Kelas XI · SMA webLab</p>\n  <h2>Tentang Saya</h2>\n  <p>Saya ingin belajar membuat website.</p>\n</main>`,
  css:`body {\n  font-family: Arial, sans-serif;\n  padding: 32px;\n}\n\n.profile {\n  max-width: 620px;\n  margin: auto;\n}\n\nh1 { color: #0f766e; }`,
  checkpoint:[{question:"Mengapa nama siswa lebih tepat memakai <h1> daripada <p>?",answer:"Karena nama berfungsi sebagai judul utama halaman dan menunjukkan hierarchy informasi."},{question:"Jika CSS dihapus, apa yang seharusnya tetap jelas?",answer:"Urutan dan makna konten HTML harus tetap dapat dipahami."}],
  project:{title:"Profil Digital Pertamaku",brief:"Buat satu halaman profil siswa yang tetap mudah dipahami walaupun semua CSS dimatikan.",uses:["main","h1/h2","p","semantic hierarchy"],requirements:["1 judul utama berisi nama","Informasi kelas dan sekolah","Section Tentang Saya","Section Target Belajar berisi minimal 3 target"],successCriteria:["Hanya ada satu h1","Urutan heading masuk akal","Tidak memakai tag hanya karena tampilannya"],stretch:"Tambahkan footer berisi tahun dan nama pembuat."},
  hints:["Tulis isi konten dulu sebelum CSS.","Gunakan h2 untuk judul bagian di bawah h1."],
  quiz:{question:"Mengapa semantic HTML penting?",options:["Agar semua teks berwarna","Agar struktur dan makna konten jelas","Agar JavaScript tidak dibutuhkan","Agar semua elemen menjadi besar"],answer:1,explanation:"Semantic HTML membantu manusia, browser, mesin pencari, dan teknologi aksesibilitas memahami struktur konten."}
 })]
},
{
 slug:"02-teks-link-gambar",order:2,stage:"HTML Fundamental",title:"Teks, Link & Gambar",description:"Membuat konten informatif dengan hyperlink dan gambar yang aksesibel.",lessons:[lesson({
  slug:"lesson-utama",title:"Konten yang Bisa Dibaca, Diklik, dan Dilihat",visual:"link-image",
  objectives:["Menyusun hierarchy teks","Membuat link dengan tujuan jelas","Menambahkan gambar dengan alt text yang berguna"],
  story:"Website sekolah biasanya punya judul berita, foto kegiatan, deskripsi, lalu tombol Baca Selengkapnya. Tiga jenis konten itu memakai pola HTML yang berbeda karena fungsinya berbeda.",
  why:"Link yang tidak jelas dan gambar tanpa alt membuat website membingungkan, terutama untuk pengguna screen reader atau ketika gambar gagal dimuat.",
  explanation:["Heading membentuk outline informasi. Jangan memilih h3 hanya karena ukurannya kecil; pilih level heading berdasarkan struktur.","Tag <a> menghubungkan satu resource ke resource lain. Teks link harus menjelaskan tujuan, misalnya 'Lihat jadwal ujian', bukan sekadar 'klik di sini'.","Tag <img> membutuhkan src sebagai alamat gambar dan alt sebagai deskripsi singkat. Alt menjelaskan fungsi/isi gambar, bukan menuliskan kata 'gambar'."],
  concepts:[{title:"href",body:"Alamat tujuan link pada elemen <a>."},{title:"src",body:"Sumber file yang ditampilkan, misalnya pada <img>."},{title:"alt",body:"Teks alternatif yang menjelaskan gambar saat gambar tidak terlihat atau dibaca screen reader."}],
  walkthrough:[{title:"1. Tentukan pesan utama",body:"Judul h1/h2 memberi konteks sebelum pengguna melihat gambar."},{title:"2. Pilih gambar relevan",body:"Gambar mendukung isi, bukan sekadar dekorasi."},{title:"3. Tulis alt",body:"Bayangkan kamu menjelaskan gambar kepada teman melalui telepon."},{title:"4. Tulis link deskriptif",body:"Pengguna harus tahu ke mana link menuju sebelum mengeklik."}],
  html:`<article class="hobi-card">\n  <img src="https://picsum.photos/640/360" alt="Meja belajar dengan laptop dan buku" />\n  <h2>Hobi Saya: Coding</h2>\n  <p>Saya suka membuat tampilan website sederhana.</p>\n  <a href="https://developer.mozilla.org/">Belajar HTML lebih lanjut</a>\n</article>`,
  css:`.hobi-card {\n  max-width: 520px;\n  margin: auto;\n}\nimg {\n  width: 100%;\n  border-radius: 16px;\n}\na {\n  color: #0f766e;\n  font-weight: 700;\n}`,
  checkpoint:[{question:"Apa beda href dan src?",answer:"href menunjuk tujuan navigasi, sedangkan src menunjuk resource yang dimuat/ditampilkan."},{question:"Alt yang baik untuk foto siswa presentasi seperti apa?",answer:"Contoh: 'Siswa kelas XI mempresentasikan project website di depan kelas'."}],
  project:{title:"Kartu Hobi dengan Gambar",brief:"Buat kartu hobi yang memberi informasi lengkap, bukan hanya dekoratif.",uses:["heading","p","a href","img src/alt"],requirements:["Satu gambar relevan","Alt text deskriptif","Judul hobi","Deskripsi minimal 2 kalimat","Link dengan teks tujuan yang jelas"],successCriteria:["Link bisa dibuka","Gambar punya alt bermakna","Hierarchy heading benar"],stretch:"Tambahkan link kedua yang membuka resource di tab baru dan pelajari rel yang aman."},
  hints:["Jangan tulis alt='gambar hobi'. Jelaskan isi gambar.","Teks link sebaiknya bisa dipahami tanpa membaca paragraf sebelumnya."],
  quiz:{question:"Atribut yang menentukan tujuan hyperlink adalah?",options:["src","href","alt","class"],answer:1,explanation:"href berisi alamat tujuan untuk elemen <a>."}
 })]
},
{
 slug:"03-list-tabel",order:3,stage:"HTML Fundamental",title:"List & Table",description:"Memilih struktur yang tepat untuk daftar dan data tabular.",lessons:[lesson({
  slug:"lesson-utama",title:"Menyajikan Data dengan Struktur yang Tepat",visual:"table",
  objectives:["Membedakan ul dan ol","Menyusun tabel dengan header","Menentukan kapan tabel boleh dipakai"],
  story:"Daftar target belajar dan jadwal pelajaran sama-sama berisi banyak data, tetapi bentuk hubungannya berbeda. Target belajar hanya kumpulan item; jadwal punya hubungan baris dan kolom.",
  why:"Memilih struktur yang tepat membuat data lebih mudah dipindai dan lebih mudah dibaca teknologi aksesibilitas.",
  explanation:["Gunakan <ul> saat urutan tidak penting, seperti daftar skill. Gunakan <ol> saat urutan punya arti, seperti langkah membuat project.","Tabel digunakan untuk data dua dimensi. <tr> adalah baris, <th> adalah sel header, dan <td> adalah sel data.","Jangan menggunakan <table> untuk mengatur posisi layout. Untuk layout gunakan Flexbox atau Grid yang akan dipelajari nanti."],
  concepts:[{title:"ul",body:"Unordered list; urutan item tidak membawa makna."},{title:"ol",body:"Ordered list; urutan langkah/ranking penting."},{title:"table",body:"Data yang dibaca melalui hubungan baris dan kolom."}],
  walkthrough:[{title:"1. Identifikasi jenis data",body:"Apakah ini kumpulan item atau data baris-kolom?"},{title:"2. Beri header",body:"Header menjelaskan arti tiap kolom."},{title:"3. Isi data konsisten",body:"Setiap baris tabel harus memiliki struktur kolom yang sejalan."},{title:"4. Styling setelah struktur",body:"Border/padding hanya memperjelas struktur yang sudah benar."}],
  html:`<h2>Target Belajar</h2>\n<ul>\n  <li>HTML semantic</li>\n  <li>CSS layout</li>\n  <li>Responsive design</li>\n</ul>\n\n<h2>Jadwal</h2>\n<table>\n  <tr><th>Hari</th><th>Materi</th></tr>\n  <tr><td>Senin</td><td>HTML</td></tr>\n  <tr><td>Rabu</td><td>CSS</td></tr>\n</table>`,
  css:`table {\n  width: 100%;\n  border-collapse: collapse;\n}\nth, td {\n  border: 1px solid #cbd5e1;\n  padding: 10px 12px;\n  text-align: left;\n}\nth { background: #f0fdfa; }`,
  checkpoint:[{question:"Daftar urutan langkah praktikum memakai ul atau ol?",answer:"ol, karena urutan langkah memiliki arti."},{question:"Mengapa tabel tidak dipakai untuk membuat dua kolom layout?",answer:"Karena tabel untuk data tabular; layout visual seharusnya memakai CSS Flexbox/Grid."}],
  project:{title:"Dashboard Jadwal Belajar",brief:"Buat halaman kecil berisi target belajar dan tabel jadwal mingguan.",uses:["ul/ol","table","tr/th/td"],requirements:["Minimal 4 target belajar","Tabel minimal 4 baris data","Header tabel jelas","Sertakan heading untuk tiap bagian"],successCriteria:["Jenis list sesuai makna","Jumlah kolom konsisten","Tabel tetap dapat dipahami tanpa CSS"],stretch:"Tambahkan kolom status seperti Belum / Selesai."},
  hints:["Mulai dari data mentah sebelum memberi style.","Jika urutan item penting, pilih ol."],
  quiz:{question:"Elemen yang tepat untuk kepala kolom tabel adalah?",options:["td","tr","th","ul"],answer:2,explanation:"th adalah table header cell dan memberi makna header pada tabel."}
 })]
},
{
 slug:"04-form",order:4,stage:"HTML Fundamental",title:"Form & Input",description:"Mendesain form yang mudah diisi dan mudah dipahami.",lessons:[lesson({
  slug:"lesson-utama",title:"Form sebagai Percakapan dengan Pengguna",visual:"form",
  objectives:["Memilih jenis input sesuai data","Menghubungkan label dan input","Menyusun form yang mudah dipindai"],
  story:"Saat siswa mendaftar ekstrakurikuler, website harus bertanya satu per satu: siapa namamu, kelas berapa, dan ekskul apa yang dipilih. Form adalah cara browser melakukan percakapan terstruktur itu.",
  why:"Form yang buruk membuat pengguna salah mengisi data. Label yang jelas dan input type yang sesuai mengurangi kesalahan dan meningkatkan aksesibilitas.",
  explanation:["<form> adalah wadah kontrol input. <label> menjelaskan data yang diminta. Label sebaiknya terkait langsung dengan kontrolnya.","Pilih input type berdasarkan jenis data: email untuk email, number untuk angka, date untuk tanggal. Browser dapat memberi keyboard dan validasi dasar yang lebih sesuai.","Gunakan <select> ketika pengguna harus memilih satu opsi dari daftar yang sudah diketahui, dan <textarea> untuk teks panjang."],
  concepts:[{title:"Label",body:"Nama pertanyaan yang menjelaskan input."},{title:"Input type",body:"Memberi tahu browser jenis data yang diharapkan."},{title:"Validation",body:"Aturan seperti required membantu mencegah data kosong sebelum dikirim."}],
  walkthrough:[{title:"1. Daftar data yang dibutuhkan",body:"Jangan menambah field yang tidak perlu."},{title:"2. Pilih kontrol",body:"Text, email, select, textarea dipilih berdasarkan bentuk datanya."},{title:"3. Beri label",body:"Pengguna tidak boleh menebak isi field."},{title:"4. Kelompokkan",body:"Susun dari informasi umum ke pilihan spesifik."}],
  html:`<form class="daftar">\n  <label for="nama">Nama lengkap</label>\n  <input id="nama" type="text" required />\n\n  <label for="kelas">Kelas</label>\n  <select id="kelas">\n    <option>XI</option>\n    <option>XII</option>\n  </select>\n\n  <label for="alasan">Alasan ikut</label>\n  <textarea id="alasan"></textarea>\n\n  <button type="button">Daftar</button>\n</form>`,
  css:`.daftar {\n  max-width: 420px;\n  display: grid;\n  gap: 10px;\n}\ninput, select, textarea, button {\n  padding: 11px;\n  border: 1px solid #cbd5e1;\n  border-radius: 9px;\n}`,
  checkpoint:[{question:"Mengapa label tidak cukup diganti placeholder?",answer:"Placeholder bisa hilang saat mengetik dan bukan pengganti label yang menetap/aksesibel."},{question:"Input email sebaiknya type text atau email?",answer:"email, karena browser memahami jenis data dan dapat membantu validasi/input keyboard."}],
  project:{title:"Form Pendaftaran Ekstrakurikuler",brief:"Bangun form yang dapat dipahami siswa tanpa penjelasan tambahan dari guru.",uses:["form","label","input","select","textarea","button"],requirements:["Nama lengkap","Email","Kelas","Pilihan ekskul","Alasan mengikuti","Tombol daftar"],successCriteria:["Semua kontrol punya label","Type input sesuai data","Urutan field logis"],stretch:"Tambahkan field tanggal lahir atau nomor telepon dengan type yang sesuai."},
  hints:["Tentukan data dulu, baru pilih elemen HTML.","Pastikan id input cocok dengan for pada label."],
  quiz:{question:"Elemen terbaik untuk pilihan dropdown adalah?",options:["input","select","textarea","section"],answer:1,explanation:"select menyediakan kumpulan option yang dapat dipilih pengguna."}
 })]
},
{
 slug:"05-css-dasar",order:5,stage:"CSS Fundamental",title:"CSS, Selector & Cascade",description:"Memahami bagaimana browser memilih elemen dan menerapkan style.",lessons:[lesson({
  slug:"lesson-utama",title:"Dari HTML Polos menjadi Tampilan Terarah",visual:"selector",
  objectives:["Menjelaskan selector-property-value","Memilih class untuk style reusable","Memahami cascade secara dasar"],
  story:"HTML seperti kerangka rumah. CSS adalah keputusan visual: warna dinding, jarak antar ruang, dan ukuran tulisan. Tapi sebelum mengecat, CSS harus tahu bagian mana yang ingin dipilih.",
  why:"Tanpa memahami selector dan cascade, siswa cenderung menambah CSS acak sampai tampilan berubah. Ini membuat stylesheet cepat sulit dirawat.",
  explanation:["Rule CSS terdiri dari selector dan declaration. Selector memilih elemen; declaration berisi property dan value.","Class selector diawali titik, misalnya .card. Class cocok untuk pola yang dipakai berulang. ID memiliki kekhususan lebih tinggi dan sebaiknya tidak dijadikan solusi default untuk styling.","Cascade berarti browser memutuskan rule mana yang menang berdasarkan sumber, specificity, dan urutan. Pada tahap ini fokus dulu: selector yang lebih spesifik dapat mengalahkan selector umum."],
  concepts:[{title:"Selector",body:"Menentukan elemen mana yang terkena style."},{title:"Property",body:"Aspek tampilan yang diubah, misalnya color atau padding."},{title:"Value",body:"Nilai property, misalnya #0f766e atau 24px."}],
  walkthrough:[{title:"1. Pilih elemen",body:"Gunakan class yang menjelaskan fungsi komponen seperti .profile-card."},{title:"2. Ubah satu property",body:"Mulai dari background atau color agar hubungan kode-hasil mudah terlihat."},{title:"3. Tambah spacing",body:"Gunakan padding untuk memberi ruang di dalam komponen."},{title:"4. Cek konflik",body:"Jika style tidak bekerja, periksa selector dan rule lain yang mungkin lebih spesifik."}],
  html:`<section class="card">\n  <span class="label">PROJECT</span>\n  <h2>Website Profil</h2>\n  <p>Project HTML pertama saya.</p>\n</section>`,
  css:`.card {\n  padding: 24px;\n  border-radius: 16px;\n  background: #ecfeff;\n}\n.card h2 { color: #0f766e; }\n.label { font-weight: 800; }`,
  checkpoint:[{question:"Apa yang dipilih oleh .card h2?",answer:"Elemen h2 yang berada di dalam elemen dengan class card."},{question:"Apa beda property dan value pada color: red?",answer:"color adalah property, red adalah value."}],
  project:{title:"Redesign Kartu Project",brief:"Gunakan CSS untuk mengubah kartu HTML polos menjadi komponen yang punya hierarchy visual.",uses:["class selector","color","background","padding","border-radius"],requirements:["Class khusus card","Warna background","Heading lebih menonjol","Spacing internal","Label kecil untuk kategori"],successCriteria:["HTML tidak diubah hanya demi styling","Selector mudah dipahami","Perubahan visual berasal dari property yang sudah dipelajari"],stretch:"Buat dua card memakai class yang sama untuk membuktikan style reusable."},
  hints:["Jangan styling semua elemen dengan id.","Uji property satu per satu sambil melihat preview."],
  quiz:{question:"Selector class bernama card ditulis sebagai?",options:["#card",".card","@card","card()"],answer:1,explanation:"Class selector menggunakan awalan titik."}
 })]
},
{
 slug:"06-box-model",order:6,stage:"CSS Fundamental",title:"Box Model, Warna & Typography",description:"Memahami ruang di dalam dan luar setiap elemen.",lessons:[lesson({
  slug:"lesson-utama",title:"Mengatur Ruang agar Desain Tidak Sesak",visual:"box-model",
  objectives:["Membedakan content, padding, border, margin","Membangun spacing hierarchy","Mengatur tipografi dasar"],
  story:"Dua kartu bisa memakai warna yang sama tetapi terasa sangat berbeda. Sering kali penyebabnya bukan warna, melainkan ruang: teks terlalu dekat border, jarak antar section sempit, atau ukuran judul tidak punya hierarchy.",
  why:"Box model adalah fondasi hampir semua layout CSS. Jika konsep ini belum kuat, siswa akan sering memakai margin/padding secara coba-coba.",
  explanation:["Setiap elemen dapat dibayangkan sebagai empat lapisan: content di tengah, padding di sekeliling content, border, lalu margin di luar border.","Padding memengaruhi ruang di dalam komponen. Margin memengaruhi jarak komponen terhadap elemen lain.","Typography hierarchy membantu pengguna memindai halaman: judul utama, subjudul, dan body text harus memiliki perbedaan yang konsisten."],
  concepts:[{title:"Content",body:"Isi nyata: teks, gambar, atau child element."},{title:"Padding",body:"Ruang dari content menuju border."},{title:"Margin",body:"Ruang di luar border terhadap elemen lain."}],
  walkthrough:[{title:"1. Lihat content",body:"Pastikan isi kartu tidak terlalu panjang."},{title:"2. Tambah padding",body:"Beri napas di dalam box sebelum mengubah ukuran box."},{title:"3. Atur margin",body:"Pisahkan kartu dari lingkungan luarnya."},{title:"4. Bangun typography",body:"Judul lebih besar/tebal, metadata lebih kecil, body nyaman dibaca."}],
  html:`<article class="profile">\n  <small>FRONTEND LEARNER</small>\n  <h2>Alya Rahma</h2>\n  <p>Sedang belajar HTML dan CSS.</p>\n</article>`,
  css:`.profile {\n  width: 300px;\n  padding: 24px;\n  margin: 32px auto;\n  border: 2px solid #14b8a6;\n  border-radius: 20px;\n}\n.profile h2 {\n  font-size: 28px;\n  margin: 4px 0 8px;\n}`,
  checkpoint:[{question:"Kartu terasa sesak di dalam border. Ubah margin atau padding?",answer:"Padding, karena masalahnya ruang antara content dan border."},{question:"Dua card terlalu berdekatan. Ubah apa?",answer:"Margin antar card atau gap pada parent layout."}],
  project:{title:"Profile Card Profesional",brief:"Buat kartu profil dengan spacing dan hierarchy yang dapat dijelaskan alasannya.",uses:["padding","margin","border","radius","font-size"],requirements:["Nama sebagai fokus utama","Role/kategori sebagai metadata","Padding konsisten","Border atau background pembeda","Jarak luar yang cukup"],successCriteria:["Tidak ada teks menempel border","Hierarchy teks jelas","Spacing tidak dipilih secara acak"],stretch:"Tambahkan CSS custom properties untuk spacing dan warna utama."},
  hints:["Coba bayangkan box model dari tengah ke luar.","Gunakan preview untuk membandingkan padding 8px vs 24px."],
  quiz:{question:"Ruang antara content dan border disebut?",options:["margin","padding","gap","outline"],answer:1,explanation:"Padding adalah ruang internal sebelum border."}
 })]
},
{
 slug:"07-flexbox",order:7,stage:"Layout Modern",title:"Flexbox",description:"Menyusun elemen pada satu sumbu secara fleksibel.",lessons:[lesson({
  slug:"lesson-utama",title:"Menyusun Navbar dan Baris Komponen dengan Flexbox",visual:"flex",
  objectives:["Mengenali parent dan flex item","Membedakan main/cross axis","Menggunakan gap, justify-content, align-items"],
  story:"Navbar punya logo di kiri dan menu di kanan. Tanpa Flexbox, siswa sering mencoba margin acak. Flexbox memberi aturan layout yang lebih jelas: parent mengatur bagaimana anak-anaknya tersusun.",
  why:"Flexbox adalah alat utama untuk layout satu dimensi seperti navbar, toolbar, tombol, dan baris kartu.",
  explanation:["display:flex dipasang pada parent. Anak langsung dari parent tersebut menjadi flex items.","justify-content mengatur distribusi item pada main axis. align-items mengatur posisi pada cross axis.","gap adalah cara yang lebih konsisten untuk memberi jarak antar flex item daripada margin di setiap anak."],
  concepts:[{title:"Flex container",body:"Parent yang memiliki display:flex."},{title:"Flex item",body:"Anak langsung dari flex container."},{title:"Axis",body:"Arah utama dan silang tempat item disusun."}],
  walkthrough:[{title:"1. Tentukan parent",body:"Cari elemen yang membungkus item yang ingin disejajarkan."},{title:"2. Aktifkan flex",body:"Tambahkan display:flex hanya pada parent tersebut."},{title:"3. Atur distribusi",body:"Gunakan justify-content sesuai kebutuhan ruang."},{title:"4. Rapikan jarak",body:"Gunakan gap dan align-items."}],
  html:`<nav class="nav">\n  <b>webLab</b>\n  <div class="menu">\n    <a href="#">Beranda</a>\n    <a href="#">Belajar</a>\n    <a href="#">Profil</a>\n  </div>\n</nav>`,
  css:`.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 24px;\n}\n.menu {\n  display: flex;\n  gap: 18px;\n}`,
  checkpoint:[{question:"display:flex dipasang pada item atau parent?",answer:"Pada parent yang akan mengatur anak-anak langsungnya."},{question:"Logo kiri dan menu kanan memakai property apa?",answer:"justify-content: space-between pada container."}],
  project:{title:"Navbar webLab",brief:"Buat navbar yang strukturnya bersih dan layout-nya sepenuhnya dikontrol Flexbox.",uses:["display:flex","justify-content","align-items","gap"],requirements:["Logo/brand di kiri","Minimal 3 menu di kanan","Item sejajar vertikal","Jarak antar menu memakai gap"],successCriteria:["Tidak memakai margin-left acak untuk mendorong menu","Parent/child flex dapat dijelaskan","Layout tetap rapi saat teks menu berubah"],stretch:"Buat menu turun ke baris berikut memakai flex-wrap dan uji pada lebar sempit."},
  hints:["Cari parent yang berisi brand dan menu.","Gunakan flex juga pada container menu."],
  quiz:{question:"Property untuk distribusi item pada main axis adalah?",options:["align-items","justify-content","font-size","z-index"],answer:1,explanation:"justify-content mengontrol distribusi item pada main axis."}
 })]
},
{
 slug:"08-grid",order:8,stage:"Layout Modern",title:"CSS Grid",description:"Membangun layout baris-kolom yang mudah berkembang.",lessons:[lesson({
  slug:"lesson-utama",title:"Gallery Project dengan CSS Grid",visual:"grid",
  objectives:["Membuat grid columns","Memakai gap","Memilih kapan Grid lebih tepat dari Flexbox"],
  story:"Gallery berisi enam project ingin tampil tiga kolom di desktop. Jika memakai Flexbox bisa saja, tetapi kita sebenarnya sedang bekerja dengan baris dan kolom sekaligus. Grid dibuat untuk kasus seperti ini.",
  why:"Grid memudahkan layout dashboard, gallery, dan card collection tanpa perhitungan width manual.",
  explanation:["display:grid menjadikan anak langsung sebagai grid item.","grid-template-columns: repeat(3, 1fr) berarti buat tiga kolom dengan bagian ruang yang sama.","Grid dan Flexbox tidak bersaing. Pilih berdasarkan masalah: satu sumbu cenderung Flexbox; dua sumbu cenderung Grid."],
  concepts:[{title:"Track",body:"Baris atau kolom pada grid."},{title:"1fr",body:"Satu bagian dari ruang yang tersedia."},{title:"gap",body:"Jarak konsisten antar track/item."}],
  walkthrough:[{title:"1. Bungkus card",body:"Semua card perlu parent gallery yang sama."},{title:"2. Aktifkan grid",body:"display:grid pada gallery."},{title:"3. Tentukan kolom",body:"Mulai dari repeat(3,1fr) untuk desktop."},{title:"4. Tambah gap",body:"Pisahkan visual antar kartu secara konsisten."}],
  html:`<section class="grid">\n  <article>HTML</article>\n  <article>CSS</article>\n  <article>JavaScript</article>\n  <article>Python</article>\n  <article>API</article>\n  <article>Database</article>\n</section>`,
  css:`.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n.grid article {\n  padding: 24px;\n  background: #f0fdfa;\n  border-radius: 14px;\n}`,
  checkpoint:[{question:"Apa arti repeat(3,1fr)?",answer:"Membuat tiga kolom yang masing-masing mengambil satu bagian sama dari ruang tersedia."},{question:"Navbar satu baris lebih natural memakai Grid atau Flexbox?",answer:"Flexbox, karena masalah utamanya satu dimensi."}],
  project:{title:"Gallery 6 Project",brief:"Bangun gallery project yang konsisten tanpa width manual pada setiap card.",uses:["display:grid","repeat","fr","gap"],requirements:["6 card","3 kolom pada kondisi desktop","Gap konsisten","Card punya padding dan radius"],successCriteria:["Semua card berada di grid yang sama","Tidak menulis width 33% per card","Kolom memiliki ukuran konsisten"],stretch:"Coba grid-template-columns: repeat(auto-fit, minmax(180px,1fr)) dan amati perbedaannya."},
  hints:["Grid dipasang pada parent gallery.","Jangan memberi posisi absolute pada card."],
  quiz:{question:"CSS Grid paling cocok untuk?",options:["Layout dua dimensi","Mengirim data form","Menulis database","Menjalankan Python"],answer:0,explanation:"Grid dirancang untuk layout yang melibatkan baris dan kolom."}
 })]
},
{
 slug:"09-responsive",order:9,stage:"Layout Modern",title:"Responsive Design",description:"Membuat satu halaman nyaman dipakai di banyak ukuran layar.",lessons:[lesson({
  slug:"lesson-utama",title:"Satu Website, Banyak Ukuran Layar",visual:"responsive",
  objectives:["Menjelaskan mobile-first","Menggunakan media query","Menguji layout pada beberapa viewport"],
  story:"Website yang indah di laptop bisa rusak di HP jika tiga card dipaksa terus berjajar. Responsive design bukan mengecilkan semuanya; kita mengubah susunan agar sesuai ruang.",
  why:"Sebagian siswa akan membuka webLab dan project teman melalui HP/Chromebook. Layout harus dapat beradaptasi tanpa membuat teks terlalu kecil atau horizontal scroll.",
  explanation:["Pendekatan mobile-first berarti style dasar ditulis untuk layar kecil terlebih dahulu, lalu ditingkatkan saat ruang lebih besar tersedia.","Media query menjalankan CSS hanya ketika kondisi tertentu terpenuhi. Contoh min-width:768px berarti rule berlaku mulai lebar tersebut.","Responsif harus diuji berdasarkan perilaku konten, bukan hanya perangkat tertentu. Coba beberapa lebar dan lihat kapan layout mulai terasa sempit."],
  concepts:[{title:"Viewport",body:"Area halaman yang terlihat pada layar browser."},{title:"Breakpoint",body:"Titik saat layout perlu berubah agar tetap nyaman."},{title:"Mobile-first",body:"Mulai dari struktur sederhana layar kecil lalu menambah kompleksitas untuk layar lebih besar."}],
  walkthrough:[{title:"1. Buat mobile dulu",body:"Satu kolom adalah baseline yang aman."},{title:"2. Perbesar viewport",body:"Cari titik saat card mulai terlihat terlalu lebar."},{title:"3. Tambah media query",body:"Pada titik itu ubah menjadi dua/tiga kolom."},{title:"4. Uji kembali",body:"Pastikan tidak ada horizontal scroll dan teks tetap nyaman."}],
  html:`<section class="cards">\n  <article>Project A</article>\n  <article>Project B</article>\n  <article>Project C</article>\n</section>`,
  css:`.cards {\n  display: grid;\n  gap: 12px;\n}\n\n@media (min-width: 768px) {\n  .cards {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}`,
  checkpoint:[{question:"Dalam mobile-first, layout default sebaiknya untuk layar kecil atau besar?",answer:"Layar kecil, lalu rule min-width menambah layout untuk ruang yang lebih besar."},{question:"Breakpoint harus mengikuti nama device tertentu?",answer:"Tidak. Breakpoint lebih baik dipilih saat konten/layout mulai membutuhkan perubahan."}],
  project:{title:"Gallery Responsive",brief:"Ubah gallery project sebelumnya agar nyaman di HP dan desktop.",uses:["media query","mobile-first","grid"],requirements:["1 kolom sebagai default","3 kolom mulai breakpoint yang masuk akal","Tidak ada horizontal scroll","Teks tetap terbaca"],successCriteria:["Layout diuji minimal pada ~375px dan ~1024px","Breakpoint dapat dijelaskan alasannya","Card tidak dipaksa terlalu sempit"],stretch:"Tambahkan kondisi tablet 2 kolom sebelum desktop 3 kolom."},
  hints:["Mulai dari satu kolom tanpa media query.","Uji preview dengan mempersempit area browser."],
  quiz:{question:"Media query digunakan untuk?",options:["Menyimpan database","Menerapkan CSS berdasarkan kondisi viewport","Mengirim email","Menjalankan JavaScript"],answer:1,explanation:"Media query mengaktifkan rule CSS ketika kondisi seperti lebar viewport terpenuhi."}
 })]
},
{
 slug:"10-motion",order:10,stage:"UI Interaction",title:"Hover, Transition & Motion",description:"Memberi feedback visual tanpa membuat UI mengganggu.",lessons:[lesson({
  slug:"lesson-utama",title:"Micro-interaction yang Membantu Pengguna",visual:"motion",
  objectives:["Menggunakan :hover","Menghaluskan perubahan dengan transition","Memakai transform sebagai feedback"],
  story:"Ketika tombol tidak memberi respons saat pointer menyentuhnya, pengguna mungkin ragu apakah tombol itu interaktif. Sedikit perubahan warna atau gerakan dapat memberi feedback yang jelas.",
  why:"Motion yang baik menjelaskan state. Motion yang berlebihan justru mengalihkan perhatian dan bisa membuat sebagian pengguna tidak nyaman.",
  explanation:[":hover adalah pseudo-class yang aktif saat pointer berada di atas elemen.","transition diletakkan pada state normal agar perubahan menuju hover dan kembali dari hover sama-sama halus.","transform seperti translateY dan scale biasanya lebih cocok untuk micro-interaction daripada mengubah posisi layout secara langsung."],
  concepts:[{title:"State",body:"Kondisi UI seperti normal, hover, focus, active."},{title:"Transition",body:"Menghaluskan perubahan property antar state."},{title:"Transform",body:"Mengubah tampilan posisi/skala tanpa menyusun ulang layout normal."}],
  walkthrough:[{title:"1. Buat state normal",body:"Pastikan tombol sudah jelas sebelum ada motion."},{title:"2. Tambah transition",body:"Contoh transition: .2s ease pada state normal."},{title:"3. Definisikan hover",body:"Naik 2–3px atau ubah shadow."},{title:"4. Uji secukupnya",body:"Jika perhatian lebih tertuju pada animasi daripada tombol, kurangi efeknya."}],
  html:`<button class="cta">Mulai Belajar</button>\n<div class="project-card">Project Portfolio</div>`,
  css:`.cta, .project-card {\n  transition: transform .2s ease, box-shadow .2s ease;\n}\n.cta:hover, .project-card:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 10px 24px #0002;\n}`,
  checkpoint:[{question:"Mengapa transition sebaiknya ditaruh di state normal?",answer:"Agar transisi berlaku saat masuk dan saat kembali dari hover."},{question:"Tujuan utama micro-interaction?",answer:"Memberi feedback/state yang membantu pengguna memahami interaksi."}],
  project:{title:"Interactive Project Card",brief:"Tambahkan feedback hover yang halus pada card tanpa mengubah struktur HTML.",uses:[":hover","transition","transform","box-shadow"],requirements:["State normal jelas","Transition maksimal sekitar beberapa ratus ms","Hover memberi perubahan yang terasa tetapi tidak berlebihan","Card tetap terbaca tanpa hover"],successCriteria:["Tidak terjadi lompatan layout besar","Motion berfungsi sebagai feedback","Tampilan normal tetap lengkap"],stretch:"Tambahkan :focus-visible agar pengguna keyboard juga mendapat feedback."},
  hints:["Mulai dari translateY(-2px) atau -3px.","Jangan membuat scale terlalu besar."],
  quiz:{question:"Property yang menghaluskan perubahan antar state adalah?",options:["transition","display","content","float"],answer:0,explanation:"transition menentukan bagaimana perubahan nilai CSS dianimasikan."}
 })]
},
{
 slug:"11-komponen-ui",order:11,stage:"Project",title:"Membangun Komponen UI",description:"Menggabungkan konsep menjadi sistem komponen yang konsisten.",lessons:[lesson({
  slug:"lesson-utama",title:"Dari Potongan Kode menjadi Sistem UI",visual:"component",
  objectives:["Mengenali pola komponen","Menggunakan design token sederhana","Menyusun landing page dari bagian reusable"],
  story:"Ketika setiap card punya warna, radius, dan spacing berbeda, website terasa seperti kumpulan tugas yang tidak berhubungan. Komponen dan design token membantu membuat semuanya terasa satu produk.",
  why:"Project yang lebih besar membutuhkan konsistensi. Token membuat perubahan global lebih mudah dan komponen mengurangi pengulangan keputusan visual.",
  explanation:["Komponen adalah pola UI yang dapat digunakan ulang, misalnya button, card, navbar, atau hero.","CSS custom properties dapat dipakai sebagai design token untuk warna, radius, dan spacing. Contoh --brand dan --radius.","Komponen yang baik punya hierarchy yang jelas dan tidak bergantung pada isi yang sangat spesifik."],
  concepts:[{title:"Component",body:"Pola tampilan yang memiliki struktur dan style konsisten."},{title:"Design token",body:"Nama untuk keputusan visual reusable seperti warna atau radius."},{title:"Consistency",body:"Aturan visual yang sama dipakai berulang sehingga website terasa satu sistem."}],
  walkthrough:[{title:"1. Tentukan token",body:"Pilih brand color, radius, dan spacing utama."},{title:"2. Bangun navbar",body:"Gunakan Flexbox dari materi sebelumnya."},{title:"3. Bangun hero",body:"Hierarchy: label → h1 → paragraph → CTA."},{title:"4. Bangun cards",body:"Gunakan Grid dan class card yang sama."}],
  html:`<nav class="nav"><b>AR.</b><a href="#project">Project</a></nav>\n<header class="hero">\n  <span>PORTFOLIO</span>\n  <h1>Halo, saya Alya.</h1>\n  <p>Saya belajar web development.</p>\n  <a class="btn" href="#project">Lihat Project</a>\n</header>\n<section id="project" class="projects">\n  <article class="card">Website Profil</article>\n  <article class="card">Gallery Responsive</article>\n</section>`,
  css:`:root {\n  --brand: #0f766e;\n  --surface: #f0fdfa;\n  --radius: 18px;\n}\n.nav { display:flex; justify-content:space-between; }\n.hero { padding:64px 24px; background:var(--surface); border-radius:var(--radius); }\n.projects { display:grid; gap:16px; margin-top:24px; }\n.card { padding:24px; border:1px solid #cbd5e1; border-radius:var(--radius); }`,
  checkpoint:[{question:"Mengapa warna brand sebaiknya disimpan dalam custom property?",answer:"Agar nilai yang sama bisa dipakai konsisten dan diubah dari satu tempat."},{question:"Apa keuntungan class card yang sama untuk banyak card?",answer:"Struktur visual konsisten dan tidak perlu mengulang keputusan style."}],
  project:{title:"Mini Landing Page",brief:"Gabungkan seluruh konsep sebelumnya menjadi landing page yang terasa sebagai satu sistem desain.",uses:["semantic HTML","Flexbox","Grid","responsive","token","component"],requirements:["Navbar","Hero + CTA","Minimal 3 project cards","Design token warna/radius","Responsive layout"],successCriteria:["Tidak ada konsep baru yang belum dipelajari","Komponen konsisten","Layout nyaman di mobile dan desktop"],stretch:"Tambahkan section testimonial atau skill dengan komponen yang mengikuti token sama."},
  hints:["Jangan mengejar banyak section; fokus konsistensi.","Reuse class dan token daripada menyalin style berbeda-beda."],
  quiz:{question:"Design token berguna terutama untuk?",options:["Menyimpan keputusan visual reusable","Membuat database","Mengirim form","Menjalankan Python"],answer:0,explanation:"Design token menjaga nilai visual seperti warna dan radius tetap konsisten."}
 })]
},
{
 slug:"12-final-project",order:12,stage:"Final Project",title:"Final Project: Portfolio Responsive",description:"Membangun portfolio utuh melalui checkpoint yang mengikuti materi 1–11.",lessons:[lesson({
  slug:"lesson-utama",title:"Bangun Portfolio dari Brief menjadi Website",visual:"portfolio",
  objectives:["Merencanakan struktur sebelum coding","Menggabungkan seluruh konsep HTML/CSS","Melakukan self-review dengan checklist"],
  story:"Final project bukan ujian menghafal. Kamu akan bekerja seperti developer: membaca brief, memecah halaman menjadi section, membuat struktur, membangun layout, lalu menguji dan memperbaiki.",
  why:"Project ini menjadi bukti bahwa kamu tidak hanya bisa mengikuti contoh, tetapi mampu memilih sendiri elemen HTML dan teknik CSS berdasarkan kebutuhan.",
  explanation:["Mulai dari content map: Navbar, Hero, About, Skills, Projects, Contact. Jangan langsung mengejar warna atau animasi.","Bangun semantic HTML hingga seluruh isi dapat dibaca tanpa CSS. Setelah itu baru styling mobile-first, lalu breakpoint desktop.","Terakhir lakukan polish: typography, spacing, warna, hover/focus, dan cek kembali semua requirement. Setiap keputusan seharusnya berasal dari konsep yang sudah dipelajari di modul sebelumnya."],
  concepts:[{title:"Plan",body:"Tentukan isi, urutan section, dan tujuan halaman."},{title:"Build",body:"Struktur HTML → style mobile → layout desktop."},{title:"Review",body:"Cek requirement, responsivitas, readability, dan consistency."}],
  walkthrough:[{title:"Checkpoint 1 — Content map",body:"Tuliskan isi setiap section sebelum coding."},{title:"Checkpoint 2 — HTML only",body:"Selesaikan semantic structure tanpa CSS."},{title:"Checkpoint 3 — Mobile style",body:"Typography, spacing, warna, satu kolom."},{title:"Checkpoint 4 — Desktop layout",body:"Gunakan Flexbox/Grid dan media query."},{title:"Checkpoint 5 — Polish",body:"Tambahkan interaction dan lakukan self-review."}],
  html:`<nav class="nav">\n  <b>Nama Kamu</b>\n  <a href="#project">Project</a>\n</nav>\n<main>\n  <section class="hero">\n    <p>WEB DEVELOPER PEMULA</p>\n    <h1>Halo, saya Nama Kamu.</h1>\n    <p>Saya membangun website yang sederhana dan mudah digunakan.</p>\n  </section>\n  <section id="project"><h2>Project</h2></section>\n</main>`,
  css:`:root { --brand:#0f766e; --radius:18px; }\n* { box-sizing:border-box; }\nbody { margin:0; font-family:system-ui; }\n.nav { display:flex; justify-content:space-between; padding:20px; }\n.hero { min-height:60vh; display:grid; place-content:center; padding:24px; }\n@media (min-width:768px) {\n  .hero { padding:64px; }\n}`,
  checkpoint:[{question:"Apa urutan kerja yang lebih aman: styling dulu atau struktur HTML dulu?",answer:"Struktur/content HTML dulu, kemudian styling. Ini mengurangi kebingungan dan memastikan makna konten benar."},{question:"Apakah final project boleh memakai teknik yang belum pernah dibahas?",answer:"Boleh sebagai challenge opsional, tetapi requirement inti harus dapat diselesaikan hanya dengan konsep modul 1–11."}],
  project:{title:"Portfolio Responsive Pribadi",brief:"Bangun portfolio yang bisa kamu tunjukkan sebagai hasil akhir track HTML & CSS. Semua requirement inti berasal dari materi yang sudah dipelajari.",uses:["semantic HTML","link/image","Flexbox","Grid","box model","responsive","motion","components"],requirements:["Navbar dengan anchor navigation","Hero dengan nama, role, CTA","About section","Skills section","Projects minimal 3 card","Contact section","Responsive mobile + desktop","Minimal satu hover/focus interaction"],successCriteria:["HTML tetap masuk akal tanpa CSS","Tidak ada horizontal scroll di mobile","Hierarchy typography jelas","Spacing dan warna konsisten","Semua project card memakai pola reusable"],stretch:"Tambahkan dark theme visual atau section testimonial tanpa JavaScript."},
  hints:["Selesaikan satu checkpoint sebelum pindah ke berikutnya.","Jangan copy desain kompleks dari internet; buat versi yang bisa kamu jelaskan sendiri.","Gunakan checklist success criteria sebelum menandai selesai."],
  quiz:{question:"Tujuan utama final project adalah?",options:["Menghafal semua tag","Membuktikan mampu menggabungkan konsep menjadi website utuh","Memakai sebanyak mungkin CSS","Membuat backend"],answer:1,explanation:"Final project mengukur kemampuan memilih dan menggabungkan konsep yang telah dipelajari dalam satu produk nyata."}
 })]
}
];

export const totalHtmlCssLessons = htmlCssModules.reduce((sum,m)=>sum+m.lessons.length,0);
export function getHtmlCssLesson(moduleSlug:string, lessonSlug:string){
  const module = htmlCssModules.find(m=>m.slug===moduleSlug);
  const lesson = module?.lessons.find(l=>l.slug===lessonSlug);
  return module && lesson ? {module,lesson} : null;
}
