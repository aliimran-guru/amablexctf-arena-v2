import { Link } from "react-router-dom";
import { 
  Users, 
  Target, 
  Code,
  Globe,
  Heart,
  Terminal,
  ArrowLeft,
  Flag,
  Trophy,
  Shield,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_NAME } from "@/lib/constants";
import logo from "@/assets/logo.gif";

const features = [
  {
    icon: Flag,
    title: "Multi-Kategori Challenge",
    description: "Web, Crypto, Pwn, Forensics, OSINT, dan Misc dengan berbagai tingkat kesulitan."
  },
  {
    icon: Trophy,
    title: "Real-time Scoreboard",
    description: "Pantau ranking dan skor secara langsung dengan update real-time."
  },
  {
    icon: Users,
    title: "Sistem Tim",
    description: "Bentuk tim, kolaborasi dengan chat built-in, dan berkompetisi bersama."
  },
  {
    icon: Zap,
    title: "Dynamic Scoring",
    description: "Poin berkurang seiring makin banyak solver, memberikan keadilan bagi semua."
  },
  {
    icon: Shield,
    title: "First Blood Bonus",
    description: "Bonus poin ekstra untuk solver pertama setiap challenge."
  },
  {
    icon: Code,
    title: "Hint System",
    description: "Sistem hint berbayar poin untuk membantu menyelesaikan challenge."
  }
];

const values = [
  {
    icon: Target,
    title: "Misi Kami",
    description: "Menyediakan platform pembelajaran keamanan siber yang accessible dan engaging untuk semua level skill."
  },
  {
    icon: Globe,
    title: "Visi Kami",
    description: "Membangun komunitas cybersecurity Indonesia yang kuat dan berkualitas internasional."
  },
  {
    icon: Heart,
    title: "Nilai Kami",
    description: "Sportivitas, integritas, pembelajaran berkelanjutan, dan kolaborasi dalam komunitas."
  }
];

export default function About() {
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
        <div className="text-center mb-16">
          <div className="mb-8 inline-block relative">
            <div className="absolute inset-0 bg-primary/30 rounded-3xl blur-2xl animate-glow" />
            <img src={logo} alt={APP_NAME} className="relative h-28 w-28 rounded-2xl" />
          </div>
          <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/50 bg-primary/10 text-primary">
            <Code className="h-3 w-3 mr-2" />
            Tentang Platform
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            ABOUT <span className="text-gradient">{APP_NAME}</span>
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            <span className="text-primary font-semibold">{APP_NAME}</span> adalah platform kompetisi 
            Capture The Flag (CTF) modern yang dirancang untuk pembelajaran dan kompetisi keamanan siber. 
            Platform ini menyediakan lingkungan yang aman dan interaktif untuk mengasah skill cybersecurity.
          </p>
        </div>

        {/* What is CTF */}
        <Card className="max-w-4xl mx-auto mb-12 card-cyber">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-3">
              <Terminal className="h-5 w-5 text-primary" />
              Apa itu CTF?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              <strong className="text-foreground">Capture The Flag (CTF)</strong> adalah kompetisi keamanan siber 
              dimana peserta harus menemukan "flag" tersembunyi dengan mengeksploitasi kerentanan atau memecahkan puzzle.
            </p>
            <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
              <span className="text-muted-foreground">Flag format: </span>
              <code className="text-primary">AmablexCTF{"{"}</code>
              <code className="text-foreground">flag_tersembunyi_disini</code>
              <code className="text-primary">{"}"}</code>
            </div>
            <p>
              Setiap flag yang ditemukan memberikan poin, dan pemain/tim dengan poin tertinggi menjadi pemenang. 
              CTF adalah cara terbaik untuk belajar keamanan siber secara hands-on dan menyenangkan.
            </p>
          </CardContent>
        </Card>

        {/* Mission/Vision/Values */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {values.map((item, i) => (
            <Card 
              key={item.title} 
              className="card-cyber card-hover animate-fade-up opacity-0"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-center mb-8">
            Fitur <span className="text-gradient">Platform</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <Card 
                key={feature.title} 
                className="card-cyber animate-fade-up opacity-0"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                    <feature.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <Card className="max-w-3xl mx-auto mb-12 card-cyber">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-3">
              <Code className="h-5 w-5 text-primary" />
              Tech Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "React 18", desc: "Frontend" },
                { name: "TypeScript", desc: "Language" },
                { name: "Tailwind CSS", desc: "Styling" },
                { name: "Supabase", desc: "Backend" },
                { name: "TanStack Query", desc: "State" },
                { name: "shadcn/ui", desc: "Components" },
                { name: "Vite", desc: "Build Tool" },
                { name: "Lucide", desc: "Icons" }
              ].map((tech) => (
                <div key={tech.name} className="bg-secondary/50 rounded-lg p-3 text-center">
                  <div className="font-mono text-sm text-primary">{tech.name}</div>
                  <div className="text-xs text-muted-foreground">{tech.desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Siap untuk mengasah skill cybersecurity kamu?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button className="gap-2 gradient-primary font-display shadow-glow">
                <Terminal className="h-4 w-4" />
                Mulai Sekarang
              </Button>
            </Link>
            <Link to="/rules">
              <Button variant="outline" className="gap-2 border-primary/50 font-display">
                <Shield className="h-4 w-4" />
                Baca Peraturan
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/20 py-8 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Dibuat dengan ❤️ untuk komunitas cybersecurity Indonesia</p>
          <p className="mt-2">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
