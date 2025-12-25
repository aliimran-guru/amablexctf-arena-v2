import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock, User, Loader2, Key, Terminal } from "lucide-react";
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

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const username = (formData.get("username") as string).trim();
    const token = (formData.get("token") as string).trim();

    // Input validation
    if (!email || !password || !username || !token) {
      toast({ title: "Error", description: "Semua field harus diisi", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({ title: "Error", description: "Password minimal 6 karakter", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (username.length < 3) {
      toast({ title: "Error", description: "Username minimal 3 karakter", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      // Validate registration token
      const { data: isValid, error: tokenError } = await supabase
        .rpc('validate_registration_token', { p_token: token });

      if (tokenError) {
        toast({ 
          title: "Error Validasi Token", 
          description: "Gagal memvalidasi token. Coba lagi.", 
          variant: "destructive" 
        });
        setIsLoading(false);
        return;
      }

      if (!isValid) {
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
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
        setIsLoading(false);
        return;
      }

      // Use the token after successful signup
      if (userId) {
        await supabase.rpc('use_registration_token', { p_token: token, p_user_id: userId });
      }

      setIsLoading(false);
      toast({ title: "Berhasil!", description: "Akun berhasil dibuat! Silakan login." });
    } catch (err) {
      toast({ title: "Error", description: "Terjadi kesalahan. Silakan coba lagi.", variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-30" />
      <div className="fixed inset-0 matrix-bg" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />

      <Card className="w-full max-w-md relative card-cyber border-primary/30">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl animate-glow" />
              <img src={logo} alt={APP_NAME} className="relative h-16 w-16 rounded-xl" />
            </div>
          </Link>
          <CardTitle className="text-2xl font-display tracking-wide">{APP_NAME}</CardTitle>
          <CardDescription className="text-muted-foreground">Masuk untuk mulai hacking</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
              <TabsTrigger value="signin" className="font-display">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="font-display">Sign Up</TabsTrigger>
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
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-primary font-display tracking-wide shadow-glow" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                    <>
                      <Terminal className="h-4 w-4 mr-2" />
                      Sign In
                    </>
                  )}
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
                      className="pl-10 bg-secondary/50 border-primary/20 focus:border-primary font-mono" 
                      required 
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
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-primary font-display tracking-wide shadow-glow" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                    <>
                      <Terminal className="h-4 w-4 mr-2" />
                      Buat Akun
                    </>
                  )}
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
