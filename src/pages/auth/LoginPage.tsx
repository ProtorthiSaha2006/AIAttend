import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ScanFace, Mail, Lock, GraduationCap, UserCog, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { UserRole } from '@/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, selectedRole);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate(`/${selectedRole}`);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleIcons = {
    student: GraduationCap,
    professor: UserCog,
    admin: Shield,
  };

  const demoCredentials = {
    student: 'student@university.edu',
    professor: 'professor@university.edu',
    admin: 'admin@university.edu',
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-primary-foreground">
          <div className="max-w-md text-center space-y-8">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 animate-float">
              <ScanFace className="w-14 h-14" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">AttendEase</h1>
              <p className="text-xl text-white/80">
                AI-Powered Smart Attendance System for Modern Universities
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-white/70">Accuracy</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold">&lt;2s</div>
                <div className="text-sm text-white/70">Check-in</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-white/70">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-glow">
              <ScanFace className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>

          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)} className="w-full">
            <TabsList className="grid grid-cols-3 w-full h-12">
              {(['student', 'professor', 'admin'] as UserRole[]).map((role) => {
                const Icon = roleIcons[role];
                return (
                  <TabsTrigger
                    key={role}
                    value={role}
                    className="flex items-center gap-2 capitalize data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{role}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {(['student', 'professor', 'admin'] as UserRole[]).map((role) => (
              <TabsContent key={role} value={role} className="mt-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder={demoCredentials[role]}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link 
                          to="/forgot-password" 
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="gradient" 
                    size="lg" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Demo: Use any email or try{' '}
                      <button
                        type="button"
                        onClick={() => setEmail(demoCredentials[role])}
                        className="text-primary hover:underline font-medium"
                      >
                        {demoCredentials[role]}
                      </button>
                    </p>
                  </div>
                </form>
              </TabsContent>
            ))}
          </Tabs>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
