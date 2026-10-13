export type WebExerciseRule = { html: RegExp[]; css?: RegExp[]; minLength?: number };

export const webExerciseRules: Record<string, WebExerciseRule> = {
  "01-html-dasar": { html:[/<h1[\s>]/i,/<p[\s>]/i], minLength:40 },
  "02-teks-link-gambar": { html:[/<a[\s>][\s\S]*href=/i,/<img[\s>][\s\S]*alt=/i], minLength:70 },
  "03-list-tabel": { html:[/<(?:ul|ol)[\s>]/i,/<table[\s>]/i,/<th[\s>]/i,/<td[\s>]/i], minLength:90 },
  "04-form": { html:[/<form[\s>]/i,/<input[\s>]/i,/<select[\s>]/i,/<button[\s>]/i], minLength:100 },
  "05-css-dasar": { html:[/class=/i], css:[/\.[a-zA-Z_-][\w-]*\s*\{/i,/background|color/i], minLength:60 },
  "06-box-model": { css:[/padding\s*:/i,/margin\s*:/i,/border\s*:/i,/font|font-size/i], html:[/<(?:article|div|section)[\s>]/i], minLength:70 },
  "07-flexbox": { css:[/display\s*:\s*flex/i,/justify-content\s*:/i,/align-items\s*:/i], html:[/<nav|class=/i], minLength:70 },
  "08-grid": { css:[/display\s*:\s*grid/i,/grid-template-columns\s*:/i,/gap\s*:/i], html:[/class=/i], minLength:70 },
  "09-responsive": { css:[/@media/i,/grid-template-columns|flex-direction/i], html:[/class=/i], minLength:70 },
  "10-motion": { css:[/:hover/i,/transition\s*:/i,/transform\s*:/i], html:[/<(?:button|a|div|article)[\s>]/i], minLength:65 },
  "11-komponen-ui": { html:[/<nav[\s>]/i,/<(?:header|section)[\s>]/i], css:[/:root|--[a-zA-Z-]+\s*:/i], minLength:100 },
  "12-final-project": { html:[/<nav[\s>]/i,/<section[\s>]/i,/id=["']?project/i], css:[/@media|display\s*:\s*(?:grid|flex)/i], minLength:180 }
};

export function validateWebExercise(moduleSlug:string, html:string, css:string){
  const rule=webExerciseRules[moduleSlug];
  if(!rule) return {ok:false,message:"Validator tugas belum tersedia."};
  if((html+css).trim().length < (rule.minLength||1)) return {ok:false,message:"Kode masih terlalu singkat. Lengkapi requirement proyek terlebih dahulu."};
  if(rule.html?.some(r=>!r.test(html))) return {ok:false,message:"Struktur HTML belum memenuhi requirement tugas. Cek kembali elemen wajib."};
  if(rule.css?.some(r=>!r.test(css))) return {ok:false,message:"CSS belum memenuhi requirement tugas. Cek property/layout yang diwajibkan."};
  return {ok:true,message:"Tugas HTML & CSS memenuhi requirement utama."};
}
