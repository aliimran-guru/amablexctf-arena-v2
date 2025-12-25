import { Link } from "react-router-dom";
import { 
  Flag, 
  Trophy, 
  Users, 
  Shield, 
  Zap, 
  Terminal,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useScoreboard } from "@/hooks/useScoreboard";
import { APP_NAME } from "@/lib/constants";
import logo from "@/assets/logo.gif";

const features = [
  {
    icon: Flag,
    title: "Capture The Flag",
    description: "Solve challenging security puzzles across multiple categories including Web, Crypto, Pwn, Forensics, and OSINT."
  },
  {
    icon: Trophy,
    title: "Real-time Scoreboard",
    description: "Track your progress with live score updates and compete for the top spot on our dynamic leaderboard."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Form teams, strategize together with built-in chat, and solve challenges collaboratively."
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Built with security-first architecture featuring isolated challenge environments and encrypted communications."
  },
  {
    icon: Zap,
    title: "Dynamic Scoring",
    description: "Points decrease as more players solve challenges, rewarding early solvers with higher scores."
  },
  {
    icon: Terminal,
    title: "Diverse Categories",
    description: "From web exploitation to cryptography, explore various domains of cybersecurity challenges."
  }
];

const categories = [
  { name: "Web", color: "bg-category-web", description: "Web application security" },
  { name: "Crypto", color: "bg-category-crypto", description: "Cryptography challenges" },
  { name: "Pwn", color: "bg-category-pwn", description: "Binary exploitation" },
  { name: "Forensics", color: "bg-category-forensic", description: "Digital forensics" },
  { name: "OSINT", color: "bg-category-osint", description: "Open source intelligence" },
  { name: "Misc", color: "bg-category-misc", description: "Miscellaneous puzzles" },
];

export default function Index() {
  const { user } = useAuth();
  const { players } = useScoreboard();

  const topPlayers = players?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="AmablexCTF Logo" className="h-10 w-10 rounded-lg" />
            <span className="font-bold text-xl tracking-tight">{APP_NAME}</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button className="gap-2">
                  Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button className="gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="container relative">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Logo */}
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl animate-pulse" />
              <img 
                src={logo} 
                alt="AmablexCTF" 
                className="relative h-32 w-32 rounded-2xl shadow-2xl border-2 border-primary/20"
              />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-up">
              <Zap className="h-4 w-4" />
              Real-time CTF Competition Platform
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Master the Art of{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Cybersecurity</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground max-w-2xl mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Join {APP_NAME} and compete in capture-the-flag challenges. 
              Test your skills, learn new techniques, and climb the leaderboard.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/auth">
                <Button size="lg" className="gap-2 text-lg px-8 h-14 gradient-primary shadow-lg hover:shadow-xl transition-all">
                  Start Hacking
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/scoreboard">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 h-14">
                  <Trophy className="h-5 w-5" />
                  View Scoreboard
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">6+</div>
                <div className="text-sm text-muted-foreground mt-1">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">∞</div>
                <div className="text-sm text-muted-foreground mt-1">Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Challenge Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore diverse cybersecurity domains and test your skills across multiple disciplines.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, i) => (
              <Card 
                key={category.name} 
                className="group cursor-pointer card-hover border-2 hover:border-primary/50 animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-xl ${category.color} mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Terminal className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose {APP_NAME}?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A modern CTF platform designed for both beginners and experts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card 
                key={feature.title} 
                className="group card-hover animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      {topPlayers.length > 0 && (
        <section className="py-20 bg-secondary/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Hackers</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See who's leading the competition right now.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  {topPlayers.map((player, index) => (
                    <div 
                      key={player.id}
                      className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-secondary/50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? "bg-warning text-warning-foreground" :
                        index === 1 ? "bg-muted text-muted-foreground" :
                        index === 2 ? "bg-orange-600 text-primary-foreground" :
                        "bg-secondary text-secondary-foreground"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{player.display_name || player.username}</div>
                      </div>
                      <div className="font-mono font-bold text-primary">{player.score || 0} pts</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="text-center mt-6">
                <Link to="/scoreboard">
                  <Button variant="outline" className="gap-2">
                    View Full Scoreboard
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-10" />
            <CardContent className="relative p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Create your account and start solving challenges today. It's free!
              </p>
              <Link to="/auth">
                <Button size="lg" className="gap-2 text-lg px-8 h-14">
                  Join {APP_NAME}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="AmablexCTF Logo" className="h-8 w-8 rounded-lg" />
              <span className="font-bold">{APP_NAME}</span>
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
