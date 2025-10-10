import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, UserPlus, Shield, Mail, Phone, MapPin, Send, Heart } from "lucide-react";
import { motion } from "framer-motion";

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

  const quickLinks = [
    { text: 'كيف يعمل خدوم؟', action: handleWhatsAppClick },
    { text: 'الأسعار والعمولات', action: () => navigate('/') },
    { text: 'الأسئلة الشائعة', action: () => navigate('/') },
    { text: 'مركز المساعدة', action: handleWhatsAppClick }
  ];

  const legalLinks = [
    { text: 'دخول المدير', action: handleAdminClick },
    { text: 'سياسة الخصوصية', action: () => {} },
    { text: 'شروط الخدمة', action: () => {} },
    { text: 'سياسة الاسترداد', action: () => {} }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Decorative Gradient Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container relative z-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand Section with Newsletter */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
              <span className="font-extrabold tracking-tight text-2xl">خدوم</span>
            </div>
            
            <p className="text-gray-300 leading-relaxed max-w-md">
              منصة ذكية تربط العملاء بالمستقلين عبر واتساب مع دفع آمن وخدمة سريعة على مدار الساعة.
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="font-bold text-lg">اشترك في نشرتنا البريدية</h4>
              <div className="flex gap-2">
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  // TODO: hook up to backend/newsletter service
                }}
              >
                <Input
                  required
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                />
                <Button type="submit" className="bg-primary hover:bg-primary-dark px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button 
                size="sm" 
                variant="outline"
                className="gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
                onClick={handleWhatsAppClick}
              >
                <img src="/whatsapp-logo.svg" alt="WhatsApp" className="w-4 h-4 brightness-0 invert" />
                واتساب
              </Button>
              <Button 
                size="sm" 
                className="gap-2 bg-primary hover:bg-primary-dark"
                onClick={() => navigate('/authentication/register')}
              >
                <UserPlus className="w-4 h-4" />
                انضم الآن
              </Button>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <button 
                    onClick={link.action}
                    className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.text}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Legal */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg">تواصل معنا</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span dir="ltr">+966511809878</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>help@khadum.app</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>الرياض، السعودية</span>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              {legalLinks.slice(0, 2).map((link, i) => (
                <button 
                  key={i}
                  onClick={link.action}
                  className="block text-sm text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {link.text}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-white/10 mt-12 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400 text-center md:text-right">
              © 2025 SALMAN ABDUH ALI ALASMARI — Sales Promotion and Management. All Rights Reserved.
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>صنع بـ</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>في السعودية</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
