import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus, Shield, Mail, Phone, MapPin, Twitter, Linkedin, Instagram, Facebook, ArrowRight, Sparkles } from "lucide-react";

const FooterEnhanced = () => {
  const navigate = useNavigate();

  const handleWhatsAppClick = () => {
    const phoneNumber = '+966509811981';
    const message = encodeURIComponent('مرحبا، أريد البدء مع خدوم');
    window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  const handleAdminClick = () => {
    navigate('/admin-login');
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white mt-20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-light/10 rounded-full blur-3xl" />
      
      <div className="container relative">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-white/10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">اشترك في النشرة الإخبارية</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold">
              احصل على أحدث الفرص والمشاريع
            </h3>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              اشترك الآن واحصل على إشعارات فورية بأحدث المشاريع المتاحة والعروض الحصرية
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full gap-2 hover-lift shadow-xl"
              >
                اشترك الآن
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="space-y-6 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse" />
                <span className="font-extrabold tracking-tight text-2xl">خدوم</span>
              </div>
              <p className="text-white/80 leading-relaxed">
                منصة ذكية تربط العملاء بالمستقلين عبر واتساب مع دفع آمن وخدمة سريعة على مدار الساعة.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm rounded-full"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="w-4 h-4" />
                  واتساب
                </Button>
                <Button 
                  size="sm"
                  className="gap-2 bg-white text-primary hover:bg-white/90 rounded-full"
                  onClick={() => navigate('/authentication/register')}
                >
                  <UserPlus className="w-4 h-4" />
                  انضم الآن
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <div className="h-1 w-8 bg-white/30 rounded-full" />
                روابط سريعة
              </h4>
              <ul className="space-y-3">
                {[
                  { text: 'كيف يعمل خدوم؟', action: handleWhatsAppClick },
                  { text: 'الأسعار والعمولات', action: () => {} },
                  { text: 'الأسئلة الشائعة', action: () => {} },
                  { text: 'مركز المساعدة', action: handleWhatsAppClick },
                  { text: 'دليل المستقلين', action: () => {} },
                  { text: 'دليل العملاء', action: () => {} },
                ].map((link, i) => (
                  <li key={i}>
                    <button 
                      onClick={link.action}
                      className="text-white/80 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <div className="h-1 w-8 bg-white/30 rounded-full" />
                تواصل معنا
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">اتصل بنا</div>
                    <div dir="ltr" className="font-semibold">+966 50 981 1981</div>
                  </div>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">راسلنا</div>
                    <div className="font-semibold">support@khadoom.sa</div>
                  </div>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">موقعنا</div>
                    <div className="font-semibold">الرياض، السعودية</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Legal & Admin */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <div className="h-1 w-8 bg-white/30 rounded-full" />
                قانوني وإداري
              </h4>
              <ul className="space-y-3">
                <li>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="gap-2 p-0 h-auto font-normal justify-start text-white/80 hover:text-white hover:bg-transparent hover:translate-x-1 transition-all"
                    onClick={handleAdminClick}
                  >
                    <Shield className="w-4 h-4" />
                    دخول المدير
                  </Button>
                </li>
                {[
                  'سياسة الخصوصية',
                  'شروط الخدمة',
                  'سياسة الاسترداد',
                  'اتفاقية المستخدم',
                  'حقوق الملكية',
                ].map((item, i) => (
                  <li key={i}>
                    <button className="text-white/80 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-white/80 text-center md:text-right">
              © 2025 SALMAN ABDUH ALI ALASMARI — Sales Promotion and Management. All Rights Reserved.
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/60">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                <Shield className="w-3 h-3" />
                <span>دفع آمن 100%</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span>صُنع بـ ❤️ في السعودية</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-2">
                <span>مرخص من وزارة التجارة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterEnhanced;


