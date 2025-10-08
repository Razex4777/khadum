import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, MessageCircle } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();
  
  const t = {
    title: 'جاهز للبدء؟',
    sub: 'انطلق الآن عبر واتساب وابدأ مشروعك بأمان.',
    cta: 'ابدأ الآن',
    whatsapp: 'تحدث معنا'
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '+966509811981';
    const message = encodeURIComponent('مرحبا، أريد البدء مع خدوم');
    window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light" />
      
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#25D366]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#d4af37]/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
      
      <div className="container relative text-center text-white space-y-10">
        {/* Heading with Enhanced Typography */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <Sparkles className="w-4 h-4 text-[#d4af37] animate-pulse" />
            <span className="text-sm font-semibold">ابدأ رحلتك معنا الآن</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            <span className="block bg-gradient-to-l from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-2xl">
              {t.title}
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium">
            {t.sub}
          </p>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Button 
            size="lg"
            className="group gap-3 bg-white text-primary hover:bg-white/95 shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-105 px-10 py-7 text-xl font-bold rounded-2xl"
            onClick={() => navigate('/authentication/register')}
          >
            <span>{t.cta}</span>
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="group gap-3 border-2 border-[#25D366]/50 bg-gradient-to-r from-[#25D366]/20 to-[#128C7E]/20 text-white hover:from-[#25D366] hover:to-[#128C7E] hover:border-[#25D366] backdrop-blur-md shadow-lg hover:shadow-[#25D366]/40 transition-all duration-300 hover:scale-105 px-10 py-7 text-xl font-bold rounded-2xl"
            onClick={handleWhatsAppClick}
          >
            <img 
              src="/whatsapp-logo.svg" 
              alt="WhatsApp" 
              className="w-6 h-6 brightness-0 invert transition-transform group-hover:rotate-12"
            />
            <span>{t.whatsapp}</span>
          </Button>
        </div>

        {/* Trust Indicator */}
        <div className="pt-8">
          <p className="text-white/70 text-sm">
            انضم إلى <span className="font-bold text-[#d4af37]">500+ مستقل</span> نشط بالفعل على المنصة
          </p>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" fillOpacity="0.08"/>
        </svg>
      </div>
    </section>
  );
};

export default CTASection;
