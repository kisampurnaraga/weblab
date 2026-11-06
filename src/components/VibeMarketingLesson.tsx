"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {motion} from "motion/react";
import {markLessonComplete,readProgress} from "@/lib/progress";
import {vibeLessons,vibeLessonId} from "@/data/vibeMarketing";
import type {VibeLesson} from "@/data/vibeMarketing";
import type {ProgressState} from "@/lib/progress";
import HtmlCssPlayground from "@/components/HtmlCssPlayground";
type Draft={prompt:string;artifact:string;submittedAt?:string};
const demoHtml='<main class="ad"><span class="tag">UMKM lokal · contoh</span><h1>Kue Rumah, Teman Soremu</h1><p>Camilan rumahan dengan informasi produk yang jelas.</p><div class="products"><article><b>Roti Cokelat</b><p>Rp8.000</p></article><article><b>Roti Keju</b><p>Rp9.000</p></article><article><b>Roti Pisang</b><p>Rp8.500</p></article></div><a href="#produk" class="cta">Lihat Katalog</a><p id="produk">Data hanya untuk latihan.</p></main>';
const demoCss='.ad{padding:24px;max-width:780px;margin:auto;font-family:Arial,sans-serif;color:#183128}.tag{color:#087e5e;font-weight:700}.ad h1{font-size:clamp(30px,6vw,54px);line-height:1.1}.products{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px}.products article{padding:15px;border:1px solid #ddd;border-radius:12px}.cta{display:inline-block;padding:12px 18px;background:#087e5e;color:white;border-radius:12px;text-decoration:none}';
export default function VibeMarketingLesson({lesson}:{lesson:VibeLesson}){
 const id=vibeLessonId(lesson.slug);
 const index=vibeLessons.findIndex(l=>l.slug===lesson.slug);
 const next=vibeLessons[index+1], prev=vibeLessons[index-1];
 const [prompt,setPrompt]=useState(lesson.promptExample);
 const [artifact,setArtifact]=useState(lesson.artifactStarter);
 const [checked,setChecked]=useState<string[]>([]);
 const [submitted,setSubmitted]=useState(false);
 const [lessonDone,setLessonDone]=useState(false);
 const [score,setScore]=useState<number|null>(null);
 const [chosen,setChosen]=useState<number|null>(null);
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [example,setExample]=useState(false);
 useEffect(()=>{
   readProgress().then(p=>{
     setLessonDone(p.completedLessons.includes(id));
     setSubmitted(Boolean(p.completedExercises?.includes(id)));
     if(p.quizScores[id]!==undefined)setScore(p.quizScores[id]);
     const saved=p.vibeSubmissions?.[id];
     if(saved){setPrompt(saved.prompt);setArtifact(saved.artifact);}
   }).catch(()=>setMessage("Tidak dapat membaca progress saat ini. Periksa koneksi lalu muat ulang.")).finally(()=>setLoading(false));
 },[id]);
 async function sendTask(){
  setBusy(true);setMessage("");
  try {
   const response=await fetch("/api/progress",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({type:"vibe_task_complete",lessonId:id,prompt,artifact,checks:checked})});
   const payload=await response.json().catch(()=>({}));
   if(!response.ok)throw new Error(payload.error||"Pengiriman gagal");
   const p=payload as ProgressState;setSubmitted(Boolean(p.completedExercises?.includes(id)));
   setMessage("✓ Tugas tersimpan di akun. +20 XP diberikan sekali; guru tetap memeriksa kualitas hasil.");
  }catch(e){setMessage(e instanceof Error?e.message:"Terjadi kesalahan jaringan.");}finally{setBusy(false);}
 }
 async function sendQuiz(answer:number){
  setChosen(answer);setBusy(true);
  try{
   const res=await fetch("/api/progress",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({type:"vibe_quiz",lessonId:id,answer})});
   const p=await res.json();
   if(!res.ok)throw new Error(p.error||"Quiz gagal disimpan");
   setScore(p.quizScores[id]);setMessage("");
  }catch(e){setMessage(e instanceof Error?e.message:"Gagal menyimpan quiz.");}finally{setBusy(false);}
 }
 async function finish(){
  setBusy(true);
  try{const p=await markLessonComplete(id);setLessonDone(p.completedLessons.includes(id));}
  catch(e){setMessage(e instanceof Error?e.message:"Gagal menyimpan lesson.");}
  finally{setBusy(false);}
 }
 const showEditor=[7,8,9,10,16].includes(index+1);
 return <div className="container page-space vibe-lesson-page">
  <div className="vibe-breadcrumb"><Link href="/belajar/koding-kecerdasan-xii-ips">← XII IPS</Link><span> / Pertemuan {index+1} dari 16 / {lesson.phase}</span></div>
  <motion.header initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="vibe-lesson-header">
    <span className="eyebrow">Koding Kecerdasan · {lesson.duration}</span><h1>{lesson.title}</h1><p>{lesson.outcome}</p>
    <div className="vibe-meter"><i style={{width:((index+1)/vibeLessons.length*100)+"%"}}/></div>
  </motion.header>
  <div className="vibe-lesson-layout">
   <article className="vibe-lesson-main">
    <section className="vibe-panel"><span className="eyebrow">Kasus di sekitar kita</span><h2>Mulai dari masalah nyata</h2><p>{lesson.context}</p><div className="vibe-analogy"><strong>💡 Analoginya</strong><p>{lesson.analogy}</p></div></section>
    <section className="vibe-panel"><span className="eyebrow">Literasi konsep</span><h2>Kenapa materi ini penting?</h2>{lesson.explanation.map((x,i)=><p key={i}>{x}</p>)}
    <div className="vibe-terms">{lesson.terms.map(t=><div key={t.term}><b>{t.term}</b><p>{t.meaning}</p></div>)}</div></section>
    <section className="vibe-panel"><span className="eyebrow">Alur kerja visual</span><h2>Belajar dengan alur yang dapat diuji</h2><div className="vibe-flow">{["Riset masalah","Susun prompt","Buat artefak","Uji & revisi","Presentasi"].map((s,i)=><div key={s}><small>{String(i+1).padStart(2,"0")}</small><strong>{s}</strong></div>)}</div>
    <h3>Langkah praktik</h3><ol className="vibe-steps">{lesson.steps.map(s=><li key={s}>{s}</li>)}</ol></section>
    <section className="vibe-panel"><span className="eyebrow">Bandingkan instruksi</span><h2>Prompt belum jelas vs prompt terarah</h2>
      <div className="vibe-compare"><div><b className="vibe-bad">✕ Prompt belum jelas</b><p>{lesson.badPrompt}</p></div><div><b className="vibe-good">✓ Prompt lebih terarah</b><p>{lesson.promptExample}</p></div></div>
      <p className="muted">Mengapa versi kedua lebih baik? Karena menyebut pengguna, tujuan, batasan, dan bentuk hasil. Tidak ada model AI yang benar-benar dipanggil dalam latihan prompt di halaman ini.</p>
    </section>
    <section className="vibe-panel vibe-workshop" id="tugas"><span className="eyebrow">Workshop · +20 XP jika syarat dasar lengkap</span><h2>{lesson.taskTitle}</h2><p>{lesson.taskBrief}</p>
      <div className="vibe-steps-note">Contoh struktur hasil: {lesson.deliverableHint}</div>
      <label htmlFor="vibe-prompt">Prompt versimu untuk AI</label>
      <textarea id="vibe-prompt" rows={7} value={prompt} onChange={e=>setPrompt(e.target.value)} spellCheck={false}/>
      <div className="vibe-inline-actions"><button type="button" className="btn ghost" onClick={()=>{void navigator.clipboard.writeText(prompt);setMessage("Prompt disalin. Tempel di alat AI yang diizinkan sekolah, lalu telaah hasilnya.");}}>Salin prompt</button><button type="button" className="btn ghost" onClick={()=>setExample(x=>!x)}>{example?"Tutup":"Lihat"} checklist prompt</button></div>
      {example&&<ul>{lesson.promptChecklist.map(x=><li key={x}>{x}</li>)}</ul>}
      <label htmlFor="vibe-artifact">Hasil pekerjaanmu + revisi manusia</label>
      <textarea id="vibe-artifact" rows={10} value={artifact} onChange={e=>setArtifact(e.target.value)} placeholder="Tulis hasil karya yang sudah kamu cek dan revisi, bukan hanya menyalin jawaban AI."/>
      <p className="muted">Siswa boleh memakai AI eksternal yang diizinkan sekolah. Jangan menempelkan data pribadi pelanggan. Hasil di sini disimpan di progress akun saat tugas dikirim.</p>
      {showEditor&&<details className="vibe-preview-details"><summary>🔧 Buka latihan HTML/CSS dan live preview (opsional)</summary><p>Ubah contoh halaman berikut agar sesuai brief UMKM-mu. Ini editor lokal browser, bukan generator AI.</p><HtmlCssPlayground initialHtml={demoHtml} initialCss={demoCss}/></details>}
      <h3>Rubrik keberhasilan</h3><ul>{lesson.rubric.map(x=><li key={x}>{x}</li>)}</ul>
      <div className="vibe-checks"><p>Centang setelah benar-benar diperiksa:</p>{["Prompt menyebut tujuan dan target pengguna","Artefak saya revisi dan tidak berisi data sensitif","Saya bisa menjelaskan hasil tanpa membaca jawaban AI"].map(s=><label key={s}><input type="checkbox" checked={checked.includes(s)} onChange={e=>setChecked(v=>e.target.checked?[...v,s]:v.filter(x=>x!==s))}/>{s}</label>)}</div>
      <button className="btn primary vibe-submit" type="button" disabled={loading||busy} onClick={sendTask}>{busy?"Menyimpan...":submitted?"Perbarui tugas (XP tidak berulang)":"Kirim tugas untuk validasi +20 XP"}</button>
      {submitted&&<p className="vibe-success">✓ Tugas sudah tercatat pada akun siswa. Kualitas akhir diperiksa guru.</p>}
    </section>
    <section className="vibe-panel"><span className="eyebrow">Refleksi dan debugging</span><h2>Hindari kesalahan ini</h2><ul>{lesson.mistakes.map(x=><li key={x}>{x}</li>)}</ul><p><strong>Pikirkan:</strong> {lesson.reflection}</p></section>
    <section className="vibe-panel vibe-quiz"><span className="eyebrow">Cek pemahaman · +50 XP jika lulus sekali</span><h2>{lesson.quiz.question}</h2><div className="quiz-options">{lesson.quiz.options.map((x,i)=><button type="button" key={i} disabled={busy} className={`quiz-option ${chosen===i?(i===lesson.quiz.answer?"correct":"wrong"):""}`} onClick={()=>sendQuiz(i)}>{String.fromCharCode(65+i)}. {x}</button>)}</div>
      {chosen!==null&&<p>{chosen===lesson.quiz.answer?"✓ Benar.":"Belum tepat."} {lesson.quiz.explanation}</p>}
      {score!==null&&<p className="muted">Nilai terbaik tersimpan: {score}/100.</p>}
    </section>
    {message&&<p role="status" className={`task-message ${message.startsWith("✓")?"ok":"bad"}`}>{message}</p>}
    <button className="btn complete" disabled={loading||busy} onClick={finish}>{lessonDone?"✓ Lesson sudah selesai":busy?"Menyimpan...":"Tandai lesson selesai +10 XP"}</button>
    <div className="vibe-lesson-navigation">{prev?<Link className="btn ghost" href={`/belajar/koding-kecerdasan-xii-ips/${prev.slug}`}>← Sebelumnya</Link>:<span/>}{next?<Link className="btn primary" href={`/belajar/koding-kecerdasan-xii-ips/${next.slug}`}>Berikutnya →</Link>:<Link className="btn primary" href="/belajar/koding-kecerdasan-xii-ips">Lihat dashboard →</Link>}</div>
   </article>
   <aside className="vibe-lesson-sidebar"><div className="vibe-panel"><span className="eyebrow">Ringkasan pertemuan</span><h3>Target belajar</h3><p>{lesson.outcome}</p><h3>Checklist prompt</h3><ul>{lesson.promptChecklist.map(x=><li key={x}>{x}</li>)}</ul><a className="btn primary" href="#tugas">Ke workshop ↓</a><small className="vibe-sidebar-note">Reward lesson +10 XP, tugas +20 XP, quiz lulus +50 XP. Hanya sekali per aktivitas.</small></div></aside>
  </div>
 </div>;
}