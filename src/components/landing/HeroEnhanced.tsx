import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowRight, Sparkles, Shield, Zap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const HeroEnhanced = () => {
  const navigate = useNavigate();

  const handleWhatsAppClick = () => {
    const phoneNumber = '+966509811981';
    const message = encodeURIComponent('مرحبا، أريد البدء مع خدوم');
    window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  const handleFreelancerJoin = () => {
    navigate('/authentication/register');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-primary-ultra-light to-white pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.1)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.08)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e910_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e910_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20 hover:border-primary/40 transition-colors">
                <Sparkles className="w-4 h-4" />
                منصة المستقلين رقم 1 في السعودية
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                <span className="block mb-2">منصة خدوم</span>
                <span className="block bg-gradient-to-l from-primary via-secondary to-primary bg-clip-text text-transparent">
                  لربط المستقلين بالعملاء
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                نربط العملاء بأفضل المستقلين عبر بوت واتساب ذكي - ابحث، تواصل، واحصل على خدمات احترافية بسهولة وأمان
              </p>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-wrap items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium text-foreground">دفع آمن 100%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium text-foreground">رد فوري</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-medium text-foreground">500+ مستقل محترف</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button 
                size="lg"
                className="group gap-3 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 text-lg font-bold rounded-2xl h-auto"
                onClick={handleFreelancerJoin}
              >
                <UserPlus className="w-5 h-5 transition-transform group-hover:rotate-12" />
                انضم كمستقل الآن
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline" 
                className="group gap-3 border-2 px-8 py-6 text-lg font-bold rounded-2xl hover:bg-primary/5 transition-all duration-300 h-auto"
                onClick={handleWhatsAppClick}
              >
                <img 
                  src="/whatsapp-logo.svg" 
                  alt="WhatsApp" 
                  className="w-5 h-5 transition-transform group-hover:rotate-12"
                />
                ابدأ عبر واتساب
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="space-y-1">
                <div className="text-3xl font-black bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">500+</div>
                <div className="text-xs text-muted-foreground">مستقل محترف</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">1000+</div>
                <div className="text-xs text-muted-foreground">مشروع منجز</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent">98%</div>
                <div className="text-xs text-muted-foreground">نسبة الرضا</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image/Mockup */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
              
              {/* Dashboard Mockup - AI Generated */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                <img 
                  src="/hero/dashboard-mockup.png" 
                  alt="Dashboard Preview" 
                  className="w-full h-auto object-cover"
                />
                
                {/* Floating Badge */}
                <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">دفع آمن</div>
                      <div className="text-xs text-muted-foreground">محمي 100%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroEnhanced;
