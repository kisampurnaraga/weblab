import PythonPlayground from "@/components/PythonPlayground";
export const metadata = { title: "Python Playground" };
export default function PlaygroundPage() { return <div className="container page-space"><div className="page-heading"><span className="eyebrow">Sandbox</span><h1>Python Playground</h1><p>Eksperimen bebas. Kode berjalan di browser melalui Pyodide, bukan dieksekusi di server webLab.</p></div><PythonPlayground initialCode={'# Eksperimen Python di sini\nnama = "webLab"\nfor i in range(1, 4):\n    print(i, nama)'} /></div> }
