import { Link } from "react-router-dom";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Terminal,
  ArrowLeft,
  Flag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_NAME } from "@/lib/constants";
import logo from "@/assets/logo.gif";

const rules = [
  {
    category: "Umum",
    icon: Shield,
    color: "text-primary",
    items: [
      "Kompetisi ini bertujuan untuk pembelajaran dan pengembangan skill keamanan siber.",
      "Semua peserta wajib menjaga sportivitas dan integritas dalam berkompetisi.",
      "Keputusan admin/juri bersifat final dan tidak dapat diganggu gugat.",
      "Peserta wajib mengikuti semua pengumuman dan update dari admin."
    ]
  },
  {
    category: "Yang Diperbolehkan",
    icon: CheckCircle,
    color: "text-success",
    items: [
      "Menggunakan tools hacking standar (Burp Suite, Wireshark, IDA Pro, dll).",
      "Membuat script/exploit sendiri untuk menyelesaikan challenge.",
      "Berdiskusi dengan anggota tim sendiri.",
      "Mencari referensi dan dokumentasi di internet.",
      "Melaporkan bug atau masalah challenge ke admin."
    ]
  },
  {
    category: "Yang Dilarang",
    icon: XCircle,
    color: "text-destructive",
    items: [
      "Menyerang infrastruktur platform (server, database, dll).",
      "DoS/DDoS attack terhadap platform atau peserta lain.",
      "Berbagi flag atau solusi dengan tim/peserta lain.",
      "Brute force login atau registrasi.",
      "Menggunakan akun ganda atau identitas palsu.",
      "Melakukan hal yang merugikan peserta atau platform lain."
    ]
  },
  {
    category: "Peringatan",
    icon: AlertTriangle,
    color: "text-warning",
    items: [
      "Pelanggaran ringan: Peringatan tertulis.",
      "Pelanggaran sedang: Pengurangan poin atau diskualifikasi sementara.",
      "Pelanggaran berat: Diskualifikasi permanen dan banned dari platform.",
      "Semua aktivitas dicatat dan dapat diaudit kapan saja."
    ]
  }
];

export default function Rules() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 cyber-grid opacity-30" />
      <div className="fixed inset-0 matrix-bg" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-primary/20 glass-dark">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt={APP_NAME} className="h-10 w-10 rounded-xl" />
            <span className="font-display font-bold text-xl tracking-wider">{APP_NAME}</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-12 relative">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/50 bg-primary/10 text-primary">
            <Shield className="h-3 w-3 mr-2" />
            Peraturan Kompetisi
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            RULES & <span className="text-gradient">REGULATIONS</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Baca dan pahami semua peraturan sebelum mengikuti kompetisi.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {rules.map((section, i) => (
            <Card 
              key={section.category} 
              className="card-cyber animate-fade-up opacity-0"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-secondary ${section.color}`}>
                    <section.icon className="h-5 w-5" />
                  </div>
                  <span className="font-display">{section.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-current ${section.color}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Flag Format */}
        <Card className="max-w-3xl mx-auto mt-8 card-cyber">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Flag className="h-5 w-5 text-primary" />
              <h3 className="font-display font-bold text-lg">Format Flag</h3>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
              <code className="text-primary">AmablexCTF{"{"}</code>
              <code className="text-foreground">flag_content_here</code>
              <code className="text-primary">{"}"}</code>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Pastikan format flag sesuai saat submit. Flag bersifat case-sensitive.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/auth">
            <Button className="gap-2 gradient-primary font-display shadow-glow">
              <Terminal className="h-4 w-4" />
              Mulai Berkompetisi
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
