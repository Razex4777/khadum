import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const type = localStorage.getItem('userType');
    
    if (userData && type) {
      setUser(JSON.parse(userData));
      setUserType(type);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-tajawal relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-slate-900 to-slate-900"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-lg relative z-10 bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl shadow-green-500/10">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="h-4 w-4 rounded-full bg-green-500 shadow-[0_0_20px_rgb(34,197,94,0.9)] animate-pulse mr-3" />
            <CardTitle className="text-3xl font-bold text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              مرحباً بك في خدوم
            </CardTitle>
            <Sparkles className="h-6 w-6 text-green-400 ml-3" />
          </div>
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30 shadow-[0_0_10px_rgb(34,197,94,0.3)] mx-auto">
            مستقل
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Welcome Message */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold text-white">
                أهلاً {user.full_name}!
              </h2>
            </div>
            <p className="text-slate-400 leading-relaxed">
              تم تسجيل دخولك بنجاح كمستقل. يمكنك الآن عرض خدماتك والحصول على عملاء جدد عبر منصة خدوم.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center text-slate-300">
              <MessageCircle className="h-5 w-5 text-green-500 mr-3" />
              <span>تواصل آمن ومشفر عبر واتساب</span>
            </div>
            <div className="flex items-center text-slate-300">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span>دفع موثوق وآمن</span>
            </div>
            <div className="flex items-center text-slate-300">
              <Sparkles className="h-5 w-5 text-green-500 mr-3" />
              <span>ذكاء اصطناعي لمطابقة أفضل</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
            >
              <span>الذهاب إلى لوحة التحكم</span>
              <ArrowRight className="h-4 w-4 mr-2" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-green-500/50 transition-all duration-300"
              onClick={() => {
                // In a real app, this would open WhatsApp with the bot
                window.open('https://wa.me/966509811981?text=مرحباً، أريد البدء مع خدوم', '_blank');
              }}
            >
              <MessageCircle className="h-4 w-4 ml-2" />
              <span>بدء المحادثة عبر واتساب</span>
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              منصة خدوم - وسيطك الذكي عبر واتساب
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;