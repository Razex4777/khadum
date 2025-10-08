import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Briefcase, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Email login validation
      if (!email.includes('@')) {
        throw new Error('يرجى إدخال بريد إلكتروني صحيح');
      }

      if (password.length < 6) {
        throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      }

      console.log('🔐 Attempting email login:', email);

      // Sign in with Supabase Auth (email/password)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        } else if (authError.message.includes('Email not confirmed')) {
          throw new Error('يرجى تأكيد البريد الإلكتروني أولاً');
        } else {
          throw new Error(authError.message);
        }
      }

      if (!authData.user) {
        throw new Error('فشل في تسجيل الدخول');
      }

      // Check if this email exists in freelancers table
      const { data: freelancer, error: freelancerError } = await supabase
        .from('freelancers')
        .select('*')
        .eq('email', email)
        .single();

      if (freelancerError || !freelancer) {
        await supabase.auth.signOut();
        throw new Error('هذا الحساب غير مسجل كمستقل في النظام');
      }

      console.log('✅ Auth successful, freelancer found:', freelancer.full_name);

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${freelancer.full_name}`,
      });

      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-tajawal relative overflow-hidden theme-gradient">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'var(--gradient-hero)' }}></div>
      
      <div className="relative z-10 container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>العودة للرئيسية</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <span className="font-extrabold tracking-tight text-lg text-foreground">خدوم</span>
            <Badge className="accent-ring">متاح الآن</Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-foreground mb-2 accent-text">تسجيل دخول المستقلين</h1>
            <p className="text-muted-foreground">ادخل إلى حسابك كمستقل وابدأ رحلتك معنا</p>
          </div>

          <Card className="bg-card/80 backdrop-blur-xl border-border theme-shadow">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-foreground flex items-center justify-center gap-2">
                <Briefcase className="h-5 w-5" />
                تسجيل دخول المستقلين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">اعرض خدماتك واحصل على عملاء جدد عبر خدوم</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="freelancer-email" className="text-foreground">البريد الإلكتروني</Label>
                  <Input
                    id="freelancer-email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-right bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freelancer-password" className="text-foreground">كلمة المرور</Label>
                  <Input
                    id="freelancer-password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="text-right bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground hover-lift" 
                  disabled={isLoading}
                >
                  {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">أو</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4 border-border text-muted-foreground hover:bg-muted hover:text-foreground hover:border-primary transition-all duration-300">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  تسجيل الدخول عبر الواتساب
                </Button>
              </div>

              <div className="mt-6 text-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  ليس لديك حساب كمستقل؟{' '}
                  <Link to="/authentication/register" className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">
                    إنشاء حساب مستقل جديد
                  </Link>
                </div>
                <div className="text-xs text-muted-foreground/70 mt-2">
                  العملاء يتفاعلون معنا عبر واتساب مباشرة
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;