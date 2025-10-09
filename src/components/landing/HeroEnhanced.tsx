import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const HeroEnhanced = () => {
  const navigate = useNavigate();

  const t = {
    title: "خدوم — منصة المستقلين الذكية",
    subtitle: "نربط العملاء بالمستقلين عبر بوت واتساب ذكي - ابحث واتواصل مباشرة مع أفضل المستقلين",
    cta1: "انضم كمستقل",
    cta2: "ابدأ مع واتساب",
    feature1: "دفع آمن",
    feature2: "استجابة فورية",
    feature3: "500+ مستقل محترف",
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '+966509811981';
    const message = encodeURIComponent('مرحبا، أريد البدء مع خدوم');
    window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  const handleFreelancerJoin = () => {
    navigate('/authentication/register');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: 0.5
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--primary-dark))] via-[hsl(var(--primary))] to-[hsl(var(--primary-light))] text-white pt-24 md:pt-28 min-h-screen flex items-center">
      {/* Animated Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary-dark))]/95 via-[hsl(var(--primary))]/90 to-[hsl(var(--primary-light))]/95 z-10" />
        <motion.img
          src="/hero/hero-background.png"
          alt="Hero Background"
          className="w-full h-full object-cover"
          initial={{ scale: 1.2, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        
        {/* Enhanced Floating Orbs with Motion */}
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-3xl z-20"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/4 right-20 w-[500px] h-[500px] bg-gradient-to-tr from-[#25D366]/20 to-transparent rounded-full blur-3xl z-20"
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-bl from-[#d4af37]/15 to-transparent rounded-full blur-3xl z-20"
          animate={{
            y: [0, -25, 0],
            x: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        {/* Animated Grid Pattern */}
        <motion.div 
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 z-20"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Shimmer Effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent z-20"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2
          }}
        />
      </motion.div>
      
      <div className="container relative z-30 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div 
            className="space-y-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Heading with Gradient Text */}
            <motion.div 
              className="space-y-6"
              variants={itemVariants}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                variants={itemVariants}
              >
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span className="text-sm font-semibold text-white">منصة المستقلين رقم 1 في السعودية</span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
                variants={itemVariants}
              >
                <span className="block bg-gradient-to-l from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-2xl">
                  {t.title}
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-white/90 leading-relaxed font-medium"
                variants={itemVariants}
              >
                {t.subtitle}
              </motion.p>
            </motion.div>

            {/* Trust Features */}
            <motion.div 
              className="grid grid-cols-3 gap-4"
              variants={itemVariants}
            >
              <motion.div 
                className="text-center space-y-2"
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl font-black text-white">500+</div>
                <div className="text-sm text-white/70">مستقل محترف</div>
              </motion.div>
              <motion.div 
                className="text-center space-y-2"
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl font-black text-white">1000+</div>
                <div className="text-sm text-white/70">مشروع منجز</div>
              </motion.div>
              <motion.div 
                className="text-center space-y-2"
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl font-black text-white">98%</div>
                <div className="text-sm text-white/70">نسبة الرضا</div>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg"
                  className="group gap-3 bg-white text-[hsl(var(--primary))] hover:bg-white/95 shadow-2xl hover:shadow-white/30 transition-all duration-300 px-8 py-6 text-lg font-bold rounded-2xl"
                  onClick={handleFreelancerJoin}
                >
                  <UserPlus className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  {t.cta1}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg"
                  variant="outline" 
                  className="group gap-3 border-2 border-[#25D366] bg-gradient-to-r from-[#25D366]/20 to-[#128C7E]/20 text-white hover:from-[#25D366] hover:to-[#128C7E] backdrop-blur-sm shadow-lg hover:shadow-[#25D366]/40 transition-all duration-300 px-8 py-6 text-lg font-bold rounded-2xl"
                  onClick={handleWhatsAppClick}
                >
                  <img 
                    src="/whatsapp-logo.svg" 
                    alt="WhatsApp" 
                    className="w-5 h-5 brightness-0 invert transition-transform group-hover:rotate-12"
                  />
                  {t.cta2}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right: Feature Cards */}
          <motion.div 
            className="grid gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 space-y-3"
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#25D366]" />
              </div>
              <h3 className="text-xl font-bold text-white">{t.feature1}</h3>
              <p className="text-white/70">نظام دفع آمن ومضمون يحمي حقوق الطرفين</p>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 space-y-3"
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#d4af37]" />
              </div>
              <h3 className="text-xl font-bold text-white">{t.feature2}</h3>
              <p className="text-white/70">رد فوري على استفساراتك خلال دقائق</p>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 space-y-3"
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{t.feature3}</h3>
              <p className="text-white/70">مجتمع من أفضل المستقلين المحترفين</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default HeroEnhanced;
