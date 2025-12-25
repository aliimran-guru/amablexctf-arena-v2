import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock, User, Loader2, Key, Terminal, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { APP_NAME } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.gif";

// Rate limiting configuration
const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 60000; // 1 minute in ms
const RATE_LIMIT_COOLDOWN = 30000; // 30 seconds cooldown

interface RateLimitState {
  attempts: number;
  firstAttemptTime: number;
  lockedUntil: number;
}

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    attempts: 0,
    firstAttemptTime: 0,
    lockedUntil: 0
  });
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Cooldown timer
  useEffect(() => {
    if (rateLimitState.lockedUntil > Date.now()) {
      const interval = setInterval(() => {
        const remaining = Math.ceil((rateLimitState.lockedUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setCooldownRemaining(0);
          setRateLimitState(prev => ({ ...prev, lockedUntil: 0, attempts: 0 }));
        } else {
          setCooldownRemaining(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [rateLimitState.lockedUntil]);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    
    // Check if currently locked
    if (rateLimitState.lockedUntil > now) {
      toast({
        title: "Rate Limited",
        description: `Terlalu banyak percobaan. Tunggu ${cooldownRemaining} detik.`,
        variant: "destructive"
      });
      return false;
    }

    // Reset if window expired
    if (now - rateLimitState.firstAttemptTime > RATE_LIMIT_WINDOW) {
      setRateLimitState({
        attempts: 1,
        firstAttemptTime: now,
        lockedUntil: 0
      });
      return true;
    }

    // Check if limit exceeded
    if (rateLimitState.attempts >= RATE_LIMIT_ATTEMPTS) {
      const lockedUntil = now + RATE_LIMIT_COOLDOWN;
      setRateLimitState(prev => ({ ...prev, lockedUntil }));
      setCooldownRemaining(Math.ceil(RATE_LIMIT_COOLDOWN / 1000));
      toast({
        title: "Rate Limited",
        description: "Terlalu banyak percobaan. Silakan tunggu 30 detik.",
        variant: "destructive"
      });
      console.warn(`[Security] Rate limit triggered for auth attempts`);
      return false;
    }

    // Increment attempts
    setRateLimitState(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
      firstAttemptTime: prev.firstAttemptTime || now
    }));
    return true;
  };

  const logSecurityEvent = (event: string, details: Record<string, unknown>) => {
    console.log(`[Security] ${event}`, {
      timestamp: new Date().toISOString(),
      ...details
    });
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!checkRateLimit()) return;
    
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).trim().toLowerCase();
    const password = formData.get("password") as string;

    // Basic validation
    if (!email || !password) {
      toast({ title: "Error", description: "Email dan password harus diisi", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    logSecurityEvent("LOGIN_ATTEMPT", { email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3") });

    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      logSecurityEvent("LOGIN_FAILED", { email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"), reason: error.message });
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      logSecurityEvent("LOGIN_SUCCESS", { email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3") });
      // Reset rate limit on success
      setRateLimitState({ attempts: 0, firstAttemptTime: 0, lockedUntil: 0 });
      navigate(from, { replace: true });
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!checkRateLimit()) return;
    
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).trim().toLowerCase();
    const password = formData.get("password") as string;
    const username = (formData.get("username") as string).trim();
    const token = (formData.get("token") as string).trim().toUpperCase();

    // Input validation
    if (!email || !password || !username || !token) {
      toast({ title: "Error", description: "Semua field harus diisi", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ title: "Error", description: "Format email tidak valid", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({ title: "Error", description: "Password minimal 6 karakter", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (username.length < 3 || username.length > 30) {
      toast({ title: "Error", description: "Username harus 3-30 karakter", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    // Username format validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      toast({ title: "Error", description: "Username hanya boleh huruf, angka, dan underscore", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    logSecurityEvent("SIGNUP_ATTEMPT", { 
      email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
      username 
    });

    try {
      // Validate registration token
      const { data: isValid, error: tokenError } = await supabase
        .rpc('validate_registration_token', { p_token: token });

      if (tokenError) {
        logSecurityEvent("TOKEN_VALIDATION_ERROR", { error: tokenError.message });
        toast({ 
          title: "Error Validasi Token", 
          description: "Gagal memvalidasi token. Coba lagi.", 
          variant: "destructive" 
        });
        setIsLoading(false);
        return;
      }

      if (!isValid) {
        logSecurityEvent("INVALID_TOKEN", { token: token.substring(0, 4) + "***" });
        toast({ 
          title: "Token Tidak Valid", 
          description: "Token registrasi tidak valid, sudah kadaluarsa, atau sudah mencapai batas penggunaan.", 
          variant: "destructive" 
        });
        setIsLoading(false);
        return;
      }

      const { error, userId } = await signUp(email, password, username);
      
      if (error) {
        let errorMessage = error.message;
        if (error.message.includes("already registered")) {
          errorMessage = "Email sudah terdaftar. Silakan login.";
        }
        logSecurityEvent("SIGNUP_FAILED", { 
          email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
          reason: error.message 
        });
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
        setIsLoading(false);
        return;
      }

      // Use the token after successful signup
      if (userId) {
        await supabase.rpc('use_registration_token', { p_token: token, p_user_id: userId });
        logSecurityEvent("SIGNUP_SUCCESS", { 
          email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
          username,
          userId 
        });
      }

      // Reset rate limit on success
      setRateLimitState({ attempts: 0, firstAttemptTime: 0, lockedUntil: 0 });
      setIsLoading(false);
      toast({ title: "Berhasil!", description: "Akun berhasil dibuat! Silakan login." });
    } catch (err) {
      logSecurityEvent("SIGNUP_ERROR", { error: String(err) });
      toast({ title: "Error", description: "Terjadi kesalahan. Silakan coba lagi.", variant: "destructive" });
      setIsLoading(false);
    }
  };

  const isRateLimited = rateLimitState.lockedUntil > Date.now();

  // Don't render if already authenticated (will redirect via useEffect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-30" />
      <div className="fixed inset-0 matrix-bg" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />

      <Card className="w-full max-w-md relative card-cyber border-primary/30 z-10">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4 block">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl animate-glow" />
              <img src={logo} alt={APP_NAME} className="relative h-16 w-16 rounded-xl" />
            </div>
          </Link>
          <CardTitle className="text-2xl font-display tracking-wide">{APP_NAME}</CardTitle>
          <CardDescription className="text-muted-foreground">Masuk untuk mulai hacking</CardDescription>
        </CardHeader>
        <CardContent>
          {isRateLimited && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-destructive">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Rate limited. Tunggu {cooldownRemaining} detik.</span>
            </div>
          )}

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
              <TabsTrigger value="signin" className="font-display data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="font-display data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signin-email" 
                      name="email" 
                      type="email" 
                      placeholder="you@example.com" 
                      className="pl-10 bg-secondary/50 border-primary/20 focus:border-primary" 
                      required 
                      disabled={isLoading || isRateLimited}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signin-password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 bg-secondary/50 border-primary/20 focus:border-primary" 
                      required 
                      disabled={isLoading || isRateLimited}
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full gradient-primary font-display tracking-wide shadow-glow" 
                  disabled={isLoading || isRateLimited}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (
                    <Terminal className="h-4 w-4 mr-2" />
                  )}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-token" className="text-foreground flex items-center gap-2">
                    <Key className="h-4 w-4 text-primary" />
                    Token Registrasi
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-token" 
                      name="token" 
                      placeholder="Masukkan token dari admin" 
                      className="pl-10 bg-secondary/50 border-primary/20 focus:border-primary font-mono uppercase" 
                      required 
                      disabled={isLoading || isRateLimited}
                      autoComplete="off"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Token diperlukan untuk mendaftar. Hubungi admin untuk mendapatkan token.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-username" className="text-foreground">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-username" 
                      name="username" 
                      placeholder="hackerman" 
                      className="pl-10 bg-secondary/50 border-primary/20 focus:border-primary" 
                      required 
                      disabled={isLoading || isRateLimited}
                      autoComplete="username"
                      maxLength={30}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-email" 
                      name="email" 
                      type="email" 
                      placeholder="you@example.com" 
                      className="pl-10 bg-secondary/50 border-primary/20 focus:border-primary" 
                      required 
                      disabled={isLoading || isRateLimited}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 bg-secondary/50 border-primary/20 focus:border-primary" 
                      required 
                      disabled={isLoading || isRateLimited}
                      autoComplete="new-password"
                      minLength={6}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full gradient-primary font-display tracking-wide shadow-glow" 
                  disabled={isLoading || isRateLimited}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (
                    <Terminal className="h-4 w-4 mr-2" />
                  )}
                  Buat Akun
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/rules" className="hover:text-primary transition-colors">Peraturan</Link>
            {" · "}
            <Link to="/about" className="hover:text-primary transition-colors">Tentang</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}