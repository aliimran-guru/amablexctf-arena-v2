import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, Loader2, Terminal, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { APP_NAME } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.gif";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if we have a valid session from the reset link
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // No session, check if there's an access token in the URL
        const accessToken = searchParams.get("access_token");
        if (!accessToken) {
          toast({
            title: "Link tidak valid",
            description: "Link reset password tidak valid atau sudah kadaluarsa.",
            variant: "destructive",
          });
          navigate("/auth");
        }
      }
    };
    checkSession();
  }, [navigate, searchParams, toast]);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password tidak cocok",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password minimal 6 karakter",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSuccess(true);
        toast({
          title: "Berhasil!",
          description: "Password berhasil diubah.",
        });
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/auth");
        }, 3000);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
        <div className="fixed inset-0 cyber-grid opacity-30 -z-10" />
        <div className="fixed inset-0 matrix-bg -z-10" />

        <Card className="w-full max-w-md card-cyber border-primary/30">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Password Berhasil Diubah!</h2>
            <p className="text-muted-foreground mb-4">
              Anda akan dialihkan ke halaman login...
            </p>
            <Link to="/auth">
              <Button variant="outline">Kembali ke Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-30 -z-10" />
      <div className="fixed inset-0 matrix-bg -z-10" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[100px] animate-pulse -z-10" style={{ animationDelay: "1s" }} />

      <Card className="w-full max-w-md card-cyber border-primary/30 relative z-20">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary pointer-events-none" />
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4 inline-block">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl" />
              <img src={logo} alt={APP_NAME} className="relative h-16 w-16 rounded-xl" />
            </div>
          </Link>
          <CardTitle className="text-2xl font-display tracking-wide">Reset Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Masukkan password baru untuk akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-30">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-secondary/50 border-primary/20 focus:border-primary"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-foreground">Konfirmasi Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-secondary/50 border-primary/20 focus:border-primary"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full gradient-primary font-display tracking-wide shadow-glow relative z-50 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Terminal className="h-4 w-4 mr-2" />
              )}
              Reset Password
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary">
              Kembali ke halaman login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
