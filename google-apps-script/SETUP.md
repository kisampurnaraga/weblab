# webLab Google Sheets Bridge

Database `webLab Student Database` dan secret bridge sudah disiapkan. Tidak perlu membuat Script Properties.

1. Buka Google Sheet `webLab Student Database`.
2. Pilih **Extensions → Apps Script**.
3. Hapus kode contoh, lalu tempel seluruh isi `google-apps-script/Code.gs` dari repository webLab.
4. Klik **Deploy → New deployment**.
5. Pilih type **Web app**.
6. Set **Execute as: Me**.
7. Set **Who has access: Anyone**.
8. Klik **Deploy** dan izinkan akses Google bila diminta.
9. Salin URL Web App yang berakhiran `/exec`.
10. URL `/exec` tersebut menjadi nilai `WEBLAB_SHEETS_API_URL` di Vercel.

`WEBLAB_SESSION_SECRET` dan `WEBLAB_SHEETS_SECRET` disimpan hanya sebagai environment variable Vercel; jangan commit secret ke source code.

Password siswa tidak pernah disimpan sebagai plaintext. webLab melakukan hashing menggunakan `scrypt` sebelum data akun dikirim ke Google Sheets.
