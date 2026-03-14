import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Hexagon, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, role, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // If user is already logged in, redirect them based on their role
    if (!authLoading && user) {
      if (role === 'admin') setLocation('/admin/dashboard');
      else if (role === 'instructor') setLocation('/instructor/dashboard');
      else setLocation('/dashboard');
    }
  }, [user, role, authLoading, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // The redirection will happen automatically in the useEffect
      // when the auth state changes and role is fetched
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid login credentials",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google sign-in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative Grid Background Elements */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10 px-4"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary flex items-center justify-center text-primary-foreground mb-6 border-4 border-foreground transform -rotate-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <Hexagon className="w-10 h-10 fill-current" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground tracking-tight underline decoration-primary decoration-4 underline-offset-8">Fieldwork</h1>
        </div>

        <Card className="border-2 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] bg-card rounded-none">
          <CardHeader className="bg-secondary border-b-2 border-border pb-6">
            <CardTitle className="text-2xl font-display font-bold text-foreground">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground font-medium text-base mt-1">Sign in to continue to your portal.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-foreground font-bold text-sm uppercase tracking-wider">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background border-2 border-border text-foreground rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] focus-visible:ring-0 focus-visible:border-primary transition-colors h-12 text-base font-medium placeholder:text-muted-foreground"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-foreground font-bold text-sm uppercase tracking-wider">Password</Label>
                    <a href="#" className="text-sm text-primary hover:text-primary/80 hover:underline font-bold">Forgot?</a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background border-2 border-border text-foreground rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] focus-visible:ring-0 focus-visible:border-primary transition-colors h-12 text-base font-medium"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4 pt-2">
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-none shadow-[4px_4px_0px_0px_rgba(255,211,0,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                  {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-bold">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full h-14 text-base font-bold bg-background text-foreground border-2 border-border hover:bg-secondary rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Sign in with Google
                </Button>
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground font-medium">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setLocation("/signup")} className="text-primary hover:underline font-bold">
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
