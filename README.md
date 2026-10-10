# webLab

Platform pembelajaran coding dan AI interaktif untuk siswa SMA/MA dan pemula.

## Fokus saat ini

Python Learning Track dengan alur:

**Konsep → Contoh → Run → Debug → Exercise → Quiz → Project**

## Stack

- Next.js 16
- React 19
- TypeScript
- Pyodide/WebAssembly untuk eksekusi Python di browser
- Vercel

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run typecheck
npm run build
```

## Arsitektur

Materi dipisahkan dari UI melalui model Course/Module/Lesson agar track HTML, CSS, JavaScript, backend, database, dan AI dapat ditambahkan tanpa membangun ulang engine pembelajaran.
