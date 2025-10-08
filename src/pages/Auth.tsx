import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Capacitor } from '@capacitor/core';
import { Moon } from "lucide-react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Session check removed for prototype - all auth bypassed

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Bypass authentication for prototype
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 500);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    
    // Bypass authentication for prototype
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 500);
  };

  const handleAppleAuth = async () => {
    setLoading(true);
    
    // Bypass authentication for prototype
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-night flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_70%)]" />
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-star-shimmer rounded-full animate-star-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md relative z-10 bg-card/80 backdrop-blur-md border-primary/20">
        <CardHeader className="text-center space-y-4 sm:space-y-6 px-4 sm:px-6 pt-6 sm:pt-8">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <Moon className="h-12 w-12 sm:h-16 sm:w-16 text-primary animate-dream-float" />
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold">DREAM</CardTitle>
              <CardDescription className="text-xs sm:text-sm font-medium">JOURNAL</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6 sm:pb-8">
          <div className="space-y-2.5 sm:space-y-3">
            <Button
              onClick={handleAppleAuth}
              disabled={loading}
              variant="default"
              className="w-full text-sm sm:text-base h-10 sm:h-11"
            >
              Continue with Apple
            </Button>
            
            <Button
              onClick={handleGoogleAuth}
              disabled={loading}
              variant="outline"
              className="w-full text-sm sm:text-base h-10 sm:h-11"
            >
              Continue with Google
            </Button>
          </div>

          <div className="relative py-2">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-2 text-xs text-muted-foreground">OR</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-3 sm:space-y-4">
            {isSignUp && (
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="displayName" className="text-sm">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={isSignUp}
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
            )}
            
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              variant="dream"
              className="w-full text-sm sm:text-base h-10 sm:h-11 mt-2"
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <div className="text-center pt-1">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs sm:text-sm h-auto p-0"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;