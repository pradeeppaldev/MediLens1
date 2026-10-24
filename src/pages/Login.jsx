import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Sparkles, ArrowRight, UserCheck, Stethoscope, Copy, Check } from 'lucide-react';
import { Logo } from '../components/Logo';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { login, demoLogin, signInWithGoogle, guestLogin } = useAuth();
  const navigate = useNavigate();

  const handleInstantDemoLogin = async (role = 'patient') => {
    try {
      setError('');
      setLoading(true);
      await demoLogin(role);
      toast.success(
        role === 'doctor'
          ? 'Logged in as Dr. Rajesh Sharma (AIIMS New Delhi)'
          : 'Welcome to MediLens Demo — Patient Aarav Sharma'
      );
      navigate('/');
    } catch (err) {
      console.error('Demo login error:', err);
      toast.error('Failed to start demo session');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('demo@medilens.in');
    setPassword('demo123');
    setCopied(true);
    toast.info('Sample credentials filled! Click "Sign in to Console"');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both email and password.');
      toast.error('Please enter email and password');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      toast.success('Welcome back to MediLens!');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      let msg = 'Failed to sign in';
      if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email address.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Incorrect email or password.';
      } else {
        msg = err.message || 'Login failed';
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      toast.success('Signed in with Google');
      navigate('/');
    } catch (err) {
      console.error('Google sign-in error:', err);
      const msg = err.code === 'auth/popup-blocked'
        ? 'Popup blocked by browser. Please allow popups.'
        : 'Google sign-in was not completed.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-gradient p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Ambient decorative glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      <Card className="w-full max-w-lg border-border/80 bg-card/95 backdrop-blur-2xl text-foreground shadow-2xl rounded-3xl relative z-10 animate-stagger-1 overflow-hidden">
        {/* Top Gradient Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500" />

        <CardHeader className="text-center pt-8 pb-4 px-6 sm:px-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" clickable={false} />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Sign In to Clinical Console
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Secure, encrypted access to medication schedules, prescription vision AI, and health telemetry.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-6 sm:px-8">
          {/* DEMO / EVALUATION CREDENTIALS CALLOUT BOX */}
          <div className="p-4 sm:p-5 rounded-2xl border-2 border-primary/30 bg-primary/5 dark:bg-primary/10 space-y-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  Quick Demo Evaluation Access
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider">
                Instant Login
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-background/80 border border-border/60">
                <span className="text-muted-foreground font-medium block text-[11px]">Demo Email</span>
                <span className="font-mono font-bold text-foreground select-all text-xs">demo@medilens.in</span>
              </div>
              <div className="p-2.5 rounded-xl bg-background/80 border border-border/60">
                <span className="text-muted-foreground font-medium block text-[11px]">Demo Password</span>
                <span className="font-mono font-bold text-foreground select-all text-xs">demo123</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <Button
                type="button"
                onClick={() => handleInstantDemoLogin('patient')}
                disabled={loading}
                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs gap-2 shadow-md shadow-blue-500/20 active:scale-[0.98]"
              >
                <UserCheck className="h-4 w-4" />
                <span>Instant Patient Demo (1-Click)</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleFillDemoCredentials}
                disabled={loading}
                className="h-10 rounded-xl text-xs font-semibold gap-1.5 border-border/80 bg-background/80 hover:bg-muted"
                title="Fill credentials into form"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Auto-Fill</span>
              </Button>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-primary/15 text-[11px] text-muted-foreground">
              <span>Looking for doctor view?</span>
              <button
                type="button"
                onClick={() => handleInstantDemoLogin('doctor')}
                className="font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Stethoscope className="h-3 w-3" />
                Dr. Rajesh Sharma (AIIMS) Demo
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-stagger-1">
              {error}
            </div>
          )}

          {/* Regular Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@medilens.in or your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-xl text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl text-sm font-bold shadow-md shadow-primary/20 mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Verifying Session...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In to Console</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Social Sign-in Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground font-semibold">Or continue with</span>
            </div>
          </div>

          {/* Google Auth Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-11 rounded-xl border-border/80 text-sm font-semibold hover:bg-muted"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google Workspace
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pb-8 pt-2 px-6 sm:px-8 text-xs text-muted-foreground border-t border-border/40">
          <div>
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Create an account
            </Link>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>256-bit HIPAA / ABDM Compliant</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
