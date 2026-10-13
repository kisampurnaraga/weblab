const SHEET_ID = '1Q7oDUs0JvGWTRXulkAMANyu1WyJKSXuONwxYqX3khc4';

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function ss() {
  return SpreadsheetApp.openById(SHEET_ID);
}

function config(key) {
  const sh = ss().getSheetByName('Konfigurasi');
  if (!sh || sh.getLastRow() < 2) return '';
  const values = sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues();
  const row = values.find(r => String(r[0]).trim() === key);
  return row ? String(row[1]) : '';
}

function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || '{}');
    const expected = config('bridge_secret');
    if (!expected || body.secret !== expected) return json({ ok: false, error: 'Unauthorized' });

    const map = {
      findStudentByUsername,
      createStudent,
      touchLogin,
      getProgress,
      saveProgress,
      getLeaderboard,
      logActivity,
    };
    if (!map[body.action]) return json({ ok: false, error: 'Unknown action' });
    return json({ ok: true, data: map[body.action](body) });
  } catch (err) {
    return json({ ok: false, error: String((err && err.message) || err) });
  }
}

function rows(name) {
  const sh = ss().getSheetByName(name);
  if (!sh) throw new Error('Sheet tidak ditemukan: ' + name);
  const values = sh.getDataRange().getValues();
  const headers = values.shift() || [];
  return { sh, headers, values };
}

function obj(headers, row) {
  const out = {};
  headers.forEach((h, i) => out[h] = row[i]);
  return out;
}

function findStudentByUsername(b) {
  const r = rows('Siswa');
  const i = r.headers.indexOf('username');
  const username = String(b.username || '').toLowerCase();
  const row = r.values.find(x => String(x[i]).toLowerCase() === username);
  return row ? obj(r.headers, row) : null;
}

function createStudent(b) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const r = rows('Siswa');
    const s = b.student || {};
    const usernameCol = r.headers.indexOf('username');
    const exists = r.values.some(x => String(x[usernameCol]).toLowerCase() === String(s.username || '').toLowerCase());
    if (exists) throw new Error('Username sudah digunakan.');
    r.sh.appendRow(r.headers.map(h => s[h] ?? ''));
    return s;
  } finally {
    lock.releaseLock();
  }
}

function touchLogin(b) {
  const r = rows('Siswa');
  const id = r.headers.indexOf('student_id');
  const col = r.headers.indexOf('last_login_at');
  const n = r.values.findIndex(x => x[id] === b.studentId);
  if (n < 0) return false;
  r.sh.getRange(n + 2, col + 1).setValue(new Date().toISOString());
  return true;
}

function emptyProgress() {
  return { completedLessons: [], quizScores: {}, xp: 0 };
}

function getProgress(b) {
  const r = rows('Progress');
  const a = r.headers.indexOf('student_id');
  const c = r.headers.indexOf('lesson_id');
  const p = r.headers.indexOf('payload_json');
  const row = r.values.find(x => x[a] === b.studentId && x[c] === '__summary__');
  if (!row) return emptyProgress();
  try { return JSON.parse(row[p] || '{}'); } catch (e) { return emptyProgress(); }
}

function saveProgress(b) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const r = rows('Progress');
    const h = r.headers;
    const a = h.indexOf('student_id');
    const c = h.indexOf('lesson_id');
    const now = new Date().toISOString();
    const progress = b.progress || emptyProgress();
    const summary = {
      student_id: b.studentId,
      course_id: 'python',
      lesson_id: '__summary__',
      status: 'sedang_belajar',
      quiz_score: '',
      xp: Number(progress.xp || 0),
      completed_at: '',
      updated_at: now,
      payload_json: JSON.stringify(progress),
    };
    upsert(r.sh, h, a, c, b.studentId, '__summary__', summary);

    const ids = {};
    (progress.completedLessons || []).forEach(x => ids[x] = true);
    Object.keys(progress.quizScores || {}).forEach(x => ids[x] = true);
    Object.keys(ids).forEach(id => {
      const done = (progress.completedLessons || []).indexOf(id) >= 0;
      const row = {
        student_id: b.studentId,
        course_id: 'python',
        lesson_id: id,
        status: done ? 'lulus' : 'sedang_belajar',
        quiz_score: progress.quizScores[id] ?? '',
        xp: '',
        completed_at: done ? now : '',
        updated_at: now,
        payload_json: '{}',
      };
      upsert(r.sh, h, a, c, b.studentId, id, row);
    });
    return progress;
  } finally {
    lock.releaseLock();
  }
}

function getLeaderboard(b) {
  const students = rows('Siswa');
  const progressRows = rows('Progress');
  const sid = students.headers.indexOf('student_id');
  const sname = students.headers.indexOf('nama_lengkap');
  const suser = students.headers.indexOf('username');
  const skelas = students.headers.indexOf('kelas');
  const sstatus = students.headers.indexOf('status');
  const pid = progressRows.headers.indexOf('student_id');
  const lesson = progressRows.headers.indexOf('lesson_id');
  const payload = progressRows.headers.indexOf('payload_json');
  const updated = progressRows.headers.indexOf('updated_at');

  const summaries = {};
  progressRows.values.forEach(row => {
    if (row[lesson] !== '__summary__') return;
    try {
      const p = JSON.parse(row[payload] || '{}');
      const quizValues = Object.keys(p.quizScores || {}).map(k => Number(p.quizScores[k])).filter(Number.isFinite);
      summaries[row[pid]] = {
        xp: Number(p.xp || 0),
        completedLessons: (p.completedLessons || []).length,
        quizAverage: quizValues.length ? Math.round(quizValues.reduce((a, v) => a + v, 0) / quizValues.length) : 0,
        updatedAt: row[updated] ? new Date(row[updated]).toISOString() : '',
      };
    } catch (e) {}
  });

  const ranking = students.values
    .filter(row => String(row[sstatus] || 'aktif') === 'aktif')
    .map(row => {
      const p = summaries[row[sid]] || { xp: 0, completedLessons: 0, quizAverage: 0, updatedAt: '' };
      return {
        studentId: row[sid],
        nama: row[sname],
        username: row[suser],
        kelas: row[skelas],
        xp: p.xp,
        completedLessons: p.completedLessons,
        quizAverage: p.quizAverage,
        updatedAt: p.updatedAt,
      };
    })
    .sort((a, z) => z.xp - a.xp || z.completedLessons - a.completedLessons || z.quizAverage - a.quizAverage || String(a.updatedAt).localeCompare(String(z.updatedAt)))
    .map((item, index) => Object.assign({ rank: index + 1 }, item));

  const me = ranking.find(x => x.studentId === b.studentId) || null;
  return { top: ranking.slice(0, 10), me };
}

function upsert(sh, headers, idCol, lessonCol, studentId, lessonId, data) {
  const values = sh.getDataRange().getValues().slice(1);
  const idx = values.findIndex(x => x[idCol] === studentId && x[lessonCol] === lessonId);
  const arr = headers.map(h => data[h] ?? '');
  if (idx < 0) sh.appendRow(arr);
  else sh.getRange(idx + 2, 1, 1, headers.length).setValues([arr]);
}

function logActivity(b) {
  const sh = ss().getSheetByName('Aktivitas');
  sh.appendRow([
    'EVT-' + Utilities.getUuid().slice(0, 8).toUpperCase(),
    b.studentId,
    b.eventType || '',
    b.referenceId || '',
    new Date().toISOString(),
    JSON.stringify(b.metadata || {}),
  ]);
  return true;
}
