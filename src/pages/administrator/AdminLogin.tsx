import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email format
      if (!email.includes('@')) {
        throw new Error('يرجى إدخال بريد إلكتروني صحيح');
      }

      if (password.length < 6) {
        throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      }

      // Check admin credentials
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .eq('password', password) // In production, use proper password hashing
        .eq('is_active', true)
        .single();

      if (error || !data) {
        throw new Error('بيانات الدخول غير صحيحة');
      }

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${data.full_name}`,
      });

      // Store admin data
      localStorage.setItem('admin', JSON.stringify(data));
      
      navigate('/administrator');
    } catch (error: any) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-tajawal relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-slate-900 to-slate-900"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>العودة للرئيسية</span>
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-red-500" />
            <span className="font-extrabold tracking-tight text-lg text-white">لوحة الإدارة</span>
            <Badge className="bg-red-600/20 text-red-400 border-red-500/30 shadow-[0_0_10px_rgb(239,68,68,0.3)]">مدير النظام</Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-red-500 mr-3" />
              <Lock className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              دخول المدير
            </h1>
            <p className="text-slate-400">الوصول إلى لوحة تحكم النظام</p>
          </div>

          <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl shadow-red-500/10">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-white">تسجيل دخول الإدارة</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-slate-300">البريد الإلكتروني</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-right bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="text-slate-300">كلمة المرور</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="text-right bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300" 
                  disabled={isLoading}
                >
                  {isLoading ? "جاري تسجيل الدخول..." : "دخول لوحة الإدارة"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-slate-500">
                  الوصول مقتصر على المديرين المعتمدين فقط
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;