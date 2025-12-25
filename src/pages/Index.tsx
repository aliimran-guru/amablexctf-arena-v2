import { Link } from "react-router-dom";
import { 
  Flag, 
  Trophy, 
  Users, 
  Shield, 
  Zap, 
  Terminal,
  ArrowRight,
  ChevronRight,
  Code,
  Lock,
  Search,
  Binary,
  Cpu,
  Skull,
  Star,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useScoreboard } from "@/hooks/useScoreboard";
import { APP_NAME } from "@/lib/constants";
import logo from "@/assets/logo.gif";

const features = [
  {
    icon: Flag,
    title: "Capture The Flag",
    description: "Pecahkan puzzle keamanan yang menantang di berbagai kategori termasuk Web, Crypto, Pwn, Forensics, dan OSINT."
  },
  {
    icon: Trophy,
    title: "Scoreboard Real-time",
    description: "Pantau progress dengan update skor langsung dan bersaing untuk posisi teratas di leaderboard dinamis."
  },
  {
    icon: Users,
    title: "Kolaborasi Tim",
    description: "Bentuk tim, strategikan bersama dengan chat built-in, dan selesaikan challenge secara kolaboratif."
  },
  {
    icon: Shield,
    title: "Platform Aman",
    description: "Dibangun dengan arsitektur security-first dengan environment challenge yang terisolasi dan komunikasi terenkripsi."
  },
  {
    icon: Zap,
    title: "Dynamic Scoring",
    description: "Poin berkurang seiring makin banyak pemain yang solve, memberikan hadiah lebih tinggi bagi solver awal."
  },
  {
    icon: Terminal,
    title: "Kategori Beragam",
    description: "Dari eksploitasi web hingga kriptografi, jelajahi berbagai domain challenge keamanan siber."
  }
];

const categories = [
  { 
    name: "Web", 
    icon: Code,
    color: "bg-category-web", 
    description: "SQL Injection, XSS, CSRF, dan kerentanan web lainnya",
    gradient: "from-green-500 to-emerald-600"
  },
  { 
    name: "Crypto", 
    icon: Lock,
    color: "bg-category-crypto", 
    description: "Kriptografi klasik hingga modern, AES, RSA, dan lainnya",
    gradient: "from-purple-500 to-pink-600"
  },
  { 
    name: "Pwn", 
    icon: Skull,
    color: "bg-category-pwn", 
    description: "Buffer overflow, ROP chains, dan eksploitasi biner",
    gradient: "from-red-500 to-orange-600"
  },
  { 
    name: "Forensics", 
    icon: Search,
    color: "bg-category-forensic", 
    description: "Analisis file, memory forensics, network analysis",
    gradient: "from-cyan-500 to-blue-600"
  },
  { 
    name: "OSINT", 
    icon: Binary,
    color: "bg-category-osint", 
    description: "Investigasi open source intelligence",
    gradient: "from-yellow-500 to-amber-600"
  },
  { 
    name: "Misc", 
    icon: Cpu,
    color: "bg-category-misc", 
    description: "Puzzle logika, steganografi, dan lainnya",
    gradient: "from-violet-500 to-purple-600"
  },
];

const stats = [
  { value: "6+", label: "Kategori", icon: Terminal },
  { value: "∞", label: "Challenge", icon: Flag },
  { value: "24/7", label: "Online", icon: Zap },
  { value: "100%", label: "Gratis", icon: Star },
];

export default function Index() {
  const { user } = useAuth();
  const { players } = useScoreboard();

  const topPlayers = players?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-50" />
      <div className="fixed inset-0 matrix-bg" />
      
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 glass-dark">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={logo} alt="AmablexCTF Logo" className="relative h-10 w-10 rounded-xl" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider">{APP_NAME}</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow hover:shadow-neon transition-shadow">
                  Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow hover:shadow-neon transition-shadow">
                    <Terminal className="h-4 w-4" />
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-category-crypto/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
        
        <div className="container relative">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            {/* Logo with Glow */}
            <div className="mb-8 relative animate-float">
              <div className="absolute inset-0 bg-primary/40 rounded-3xl blur-2xl animate-glow" />
              <div className="relative p-1 rounded-3xl bg-gradient-to-br from-primary via-accent to-category-crypto">
                <img 
                  src={logo} 
                  alt="AmablexCTF" 
                  className="h-36 w-36 rounded-2xl shadow-2xl"
                />
              </div>
            </div>

            {/* Badge */}
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm border-primary/50 bg-primary/10 text-primary animate-fade-up opacity-0" style={{ animationDelay: "0.1s" }}>
              <Zap className="h-4 w-4 mr-2" />
              Platform CTF Real-time
            </Badge>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight mb-6 animate-fade-up opacity-0" style={{ animationDelay: "0.2s" }}>
              <span className="block text-foreground drop-shadow-lg">MASTER THE ART OF</span>
              <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-category-crypto bg-clip-text text-transparent drop-shadow-[0_0_30px_hsl(142,76%,50%,0.5)]">
                CYBERSECURITY
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10 animate-fade-up opacity-0" style={{ animationDelay: "0.3s" }}>
              Bergabung dengan <span className="text-primary font-semibold">{APP_NAME}</span> dan berkompetisi dalam challenge capture-the-flag. 
              Uji skill kamu, pelajari teknik baru, dan naik ke puncak leaderboard.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up opacity-0" style={{ animationDelay: "0.4s" }}>
              <Link to="/auth">
                <Button size="lg" className="gap-3 text-lg px-10 h-16 gradient-primary shadow-neon hover:scale-105 transition-transform font-display tracking-wide">
                  <Terminal className="h-6 w-6" />
                  MULAI HACKING
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/scoreboard">
                <Button size="lg" variant="outline" className="gap-3 text-lg px-10 h-16 border-primary/50 hover:bg-primary/10 hover:border-primary font-display tracking-wide">
                  <Trophy className="h-6 w-6" />
                  LIHAT SCOREBOARD
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl animate-fade-up opacity-0" style={{ animationDelay: "0.5s" }}>
              {stats.map((stat, i) => (
                <Card key={stat.label} className="card-cyber border-primary/20 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-3xl md:text-4xl font-display font-bold text-gradient">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Terminal decoration */}
        <div className="container mt-16 hidden lg:block">
          <Card className="max-w-3xl mx-auto card-cyber overflow-hidden animate-fade-up opacity-0" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-primary/20">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-warning" />
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="ml-4 text-sm text-muted-foreground font-mono">terminal@amablexctf:~$</span>
            </div>
            <CardContent className="p-6 font-mono text-sm">
              <div className="text-muted-foreground">
                <span className="text-primary">$</span> ./start_challenge --category web
              </div>
              <div className="mt-2 text-success">
                [+] Challenge loaded: SQL Injection 101
              </div>
              <div className="text-muted-foreground mt-1">
                [*] Objective: Find the hidden flag in the database
              </div>
              <div className="mt-2 text-primary">
                <span className="text-muted-foreground">$</span> submit_flag AmablexCTF{"{"}SQL_1nj3ct10n_m4st3r{"}"}
              </div>
              <div className="mt-2 text-success animate-pulse">
                [+] Correct! +500 points awarded 🎉
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-24 bg-secondary/30">
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="container relative">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/50 bg-primary/10 text-primary">
              <Terminal className="h-3 w-3 mr-2" />
              Kategori Challenge
            </Badge>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              PILIH <span className="text-gradient">BATTLEGROUND</span> KAMU
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Jelajahi berbagai domain keamanan siber dan uji skill kamu di berbagai disiplin.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, i) => (
              <Card 
                key={category.name} 
                className="group card-cyber card-hover overflow-hidden animate-fade-up opacity-0"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className={`h-2 bg-gradient-to-r ${category.gradient}`} />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                        <category.icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 matrix-bg opacity-50" />
        <div className="container relative">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/50 bg-primary/10 text-primary">
              <Star className="h-3 w-3 mr-2" />
              Fitur Platform
            </Badge>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              KENAPA PILIH <span className="text-gradient">{APP_NAME}</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Platform CTF modern yang dirancang untuk pemula hingga expert.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card 
                key={feature.title} 
                className="group card-cyber card-hover animate-fade-up opacity-0"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-glow">
                    <feature.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      {topPlayers.length > 0 && (
        <section className="relative py-24 bg-secondary/30">
          <div className="absolute inset-0 cyber-grid opacity-30" />
          <div className="container relative">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/50 bg-primary/10 text-primary">
                <TrendingUp className="h-3 w-3 mr-2" />
                Top Players
              </Badge>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                <span className="text-gradient">ELITE</span> HACKERS
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Lihat siapa yang memimpin kompetisi saat ini.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="card-cyber overflow-hidden">
                <CardContent className="p-0">
                  {topPlayers.map((player, index) => (
                    <div 
                      key={player.id}
                      className="flex items-center gap-4 p-5 border-b border-primary/10 last:border-0 hover:bg-primary/5 transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm ${
                        index === 0 ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-black shadow-lg" :
                        index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-black" :
                        index === 2 ? "bg-gradient-to-br from-orange-400 to-orange-700 text-white" :
                        "bg-secondary text-muted-foreground"
                      }`}>
                        {index === 0 ? "🏆" : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-display font-medium group-hover:text-primary transition-colors">
                          {player.display_name || player.username}
                        </div>
                        {index === 0 && (
                          <Badge variant="outline" className="mt-1 text-xs border-warning/50 text-warning">
                            👑 Leader
                          </Badge>
                        )}
                      </div>
                      <div className="font-mono font-bold text-primary text-lg">
                        {player.score || 0} <span className="text-sm text-muted-foreground">pts</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="text-center mt-8">
                <Link to="/scoreboard">
                  <Button variant="outline" className="gap-2 font-display border-primary/50 hover:bg-primary/10">
                    Lihat Scoreboard Lengkap
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 matrix-bg" />
        <div className="container relative">
          <Card className="relative overflow-hidden border-primary/30">
            <div className="absolute inset-0 gradient-cyber opacity-10" />
            <div className="absolute top-0 left-0 right-0 h-1 gradient-cyber" />
            <CardContent className="relative p-12 md:p-16 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                  SIAP UNTUK <span className="text-gradient-cyber neon-text">BERKOMPETISI</span>?
                </h2>
                <p className="text-muted-foreground text-lg mb-10">
                  Buat akun dan mulai selesaikan challenge hari ini. Gratis selamanya!
                </p>
                <Link to="/auth">
                  <Button size="lg" className="gap-3 text-lg px-12 h-16 gradient-primary shadow-neon hover:scale-105 transition-transform font-display tracking-wide">
                    <Terminal className="h-6 w-6" />
                    BERGABUNG SEKARANG
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-primary/20 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={logo} alt="AmablexCTF Logo" className="h-10 w-10 rounded-xl" />
              <div>
                <div className="font-display font-bold text-lg">{APP_NAME}</div>
                <div className="text-sm text-muted-foreground">Capture The Flag Platform</div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/challenges" className="hover:text-primary transition-colors">Challenges</Link>
              <Link to="/scoreboard" className="hover:text-primary transition-colors">Scoreboard</Link>
              <Link to="/teams" className="hover:text-primary transition-colors">Teams</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
