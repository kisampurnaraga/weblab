# webLab Google Sheets Bridge

1. Buka Google Sheet `webLab Student Database`.
2. Extensions → Apps Script.
3. Tempel isi `Code.gs`.
4. Project Settings → Script Properties → tambah `WEBLAB_SECRET` dengan secret acak yang sama seperti `WEBLAB_SHEETS_SECRET` di Vercel.
5. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone.
6. Salin URL `/exec` ke `WEBLAB_SHEETS_API_URL` di Vercel.
7. Tambahkan `WEBLAB_SESSION_SECRET` dengan secret acak berbeda minimal 32 karakter.
8. Redeploy webLab.

Jangan memasukkan password plaintext ke Google Sheet. Password dari webLab di-hash menggunakan scrypt sebelum dikirim ke bridge.
