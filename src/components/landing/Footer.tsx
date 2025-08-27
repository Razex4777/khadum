import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus, Shield, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
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
    <footer className="bg-slate-900/50 border-t border-border/60 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary)/0.9)] pulse" aria-hidden />
              <span className="font-extrabold tracking-tight text-xl text-white">خدوم</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصة ذكية تربط العملاء بالمستقلين عبر واتساب مع دفع آمن وخدمة سريعة.
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 text-xs"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="w-3 h-3" />
                واتساب خدوم
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 text-xs"
                onClick={() => navigate('/authentication/register')}
              >
                <UserPlus className="w-3 h-3" />
                انضم كمستقل
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button 
                  onClick={handleWhatsAppClick}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  كيف أبدأ مع خدوم؟
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/authentication/register')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  هل الدفع آمن؟
                </button>
              </li>
              <li>
                <button 
                  onClick={handleWhatsAppClick}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  هل يدعم لغات متعددة؟
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/authentication/register')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  شروط استخدام المنصة
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">تواصل معنا</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span dir="ltr">+966 50 981 1981</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@khadoom.sa</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <button 
                  onClick={handleWhatsAppClick}
                  className="hover:text-white transition-colors"
                >
                  دردشة مباشرة عبر واتساب
                </button>
              </li>
            </ul>
          </div>

          {/* Admin & Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">إدارة المنصة</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 p-0 h-auto font-normal justify-start hover:text-white"
                  onClick={handleAdminClick}
                >
                  <Shield className="w-4 h-4" />
                  دخول المدير
                </Button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  سياسة الخصوصية
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  شروط الخدمة
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors">
                  سياسة الاسترداد
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} خدوم (Khadoom) - جميع الحقوق محفوظة
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>صُنع بـ ❤️ في المملكة العربية السعودية</span>
            <span className="hidden sm:inline">•</span>
            <span>مرخص من وزارة التجارة</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
