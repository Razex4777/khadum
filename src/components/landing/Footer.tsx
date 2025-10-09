import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserPlus, Shield, Mail, Phone, MapPin, Sparkles, Heart } from "lucide-react";
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

  return (
    <footer className="relative bg-gradient-to-br from-[hsl(var(--primary-dark))] via-[hsl(var(--primary))] to-[hsl(var(--primary-light))] text-white mt-24 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#25D366]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-3xl" />
      </div>

      <div className="container py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Section */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="h-4 w-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="font-extrabold tracking-tight text-2xl">خدوم</span>
            </div>
            <p className="text-white/80 leading-relaxed text-base">
              منصة ذكية تربط العملاء بالمستقلين عبر واتساب مع دفع آمن وخدمة سريعة على مدار الساعة.
            </p>
            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="sm" 
                  className="gap-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm"
                  onClick={handleWhatsAppClick}
                >
                  <img src="/whatsapp-logo.svg" alt="WhatsApp" className="w-4 h-4 brightness-0 invert" />
                  واتساب
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="sm" 
                  className="gap-2 bg-white text-[hsl(var(--primary))] hover:bg-white/90"
                  onClick={() => navigate('/authentication/register')}
                >
                  <UserPlus className="w-4 h-4" />
                  انضم الآن
                </Button>
              </motion.div>
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
            <h4 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              روابط سريعة
            </h4>
            <ul className="space-y-3">
              {[
                { text: 'كيف يعمل خدوم؟', action: handleWhatsAppClick },
                { text: 'الأسعار والعمولات', action: () => navigate('/') },
                { text: 'الأسئلة الشائعة', action: () => navigate('/') },
                { text: 'مركز المساعدة', action: handleWhatsAppClick },
              ].map((link, i) => (
                <li key={i}>
                  <button 
                    onClick={link.action}
                    className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    {link.text}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-bold text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              تواصل معنا
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <span dir="ltr" className="font-medium">+966511809878</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-medium">support@khadoom.sa</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-medium">الرياض، السعودية</span>
              </li>
            </ul>
          </motion.div>

          {/* Admin & Legal */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-bold text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-white" />
              قانوني وإداري
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={handleAdminClick}
                  className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                >
                  دخول المدير
                </button>
              </li>
              {['سياسة الخصوصية', 'شروط الخدمة', 'سياسة الاسترداد', 'اتفاقية المستخدم'].map((text, i) => (
                <li key={i}>
                  <button className="text-white/70 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">
                    {text}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar with Enhanced Design */}
        <motion.div 
          className="border-t border-white/20 mt-12 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center">
            <div className="text-white/90 font-medium text-sm md:text-base">
              © 2025 SALMAN ABDUH ALI ALASMARI — Sales Promotion and Management. All Rights Reserved.
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
