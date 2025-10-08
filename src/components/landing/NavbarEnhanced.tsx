import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { MessageCircle, UserPlus, Globe } from "lucide-react";

interface NavbarEnhancedProps {
  lang: 'ar' | 'en';
  onToggleLang: () => void;
}

const NavbarEnhanced = ({ lang, onToggleLang }: NavbarEnhancedProps) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Scroll detection for floating pill effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const labels = {
    ar: { 
      brand: 'خدوم', 
      whatsapp: 'واتساب', 
      become: 'انضم كمستقل', 
      lang: 'EN',
      features: 'المميزات',
      pricing: 'الأسعار',
      about: 'عن خدوم'
    },
    en: { 
      brand: 'Khadoom', 
      whatsapp: 'WhatsApp', 
      become: 'Join as Freelancer', 
      lang: 'AR',
      features: 'Features',
      pricing: 'Pricing',
      about: 'About'
    },
  }[lang];

  const handleWhatsAppClick = () => {
    const phoneNumber = '+966509811981';
    const message = encodeURIComponent('مرحبا، أريد البدء مع خدوم');
    window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  const handleFreelancerJoin = () => {
    navigate('/authentication/register');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
      ${isScrolled ? 'py-3' : 'py-4'}
    `}>
      <nav className={`
        container mx-auto transition-all duration-500 ease-out
        ${isScrolled 
          ? 'max-w-5xl glass-card rounded-full shadow-floating border-glow px-6 py-3' 
          : 'bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-soft px-6 py-2'
        }
      `}>
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className={`
              rounded-full bg-gradient-to-br from-primary to-primary-light p-2 transition-all duration-300
              ${isScrolled ? 'scale-90' : 'scale-100'}
            `}>
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
            <span className={`
              font-extrabold tracking-tight transition-all duration-300
              ${isScrolled ? 'text-base' : 'text-lg'}
            `}>
              {labels.brand}
            </span>
            {!isScrolled && (
              <Badge className="accent-ring hover-lift bg-primary/10 text-primary border-primary/20">
                متاح الآن
              </Badge>
            )}
          </div>

          {/* Navigation Links - Hidden on small screens when scrolled */}
          <div className={`
            hidden md:flex items-center gap-1 transition-all duration-300
            ${isScrolled ? 'gap-1' : 'gap-2'}
          `}>
            <Button
              variant="ghost"
              size={isScrolled ? "sm" : "default"}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => scrollToSection('features')}
            >
              {labels.features}
            </Button>
            <Button
              variant="ghost"
              size={isScrolled ? "sm" : "default"}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => scrollToSection('pricing')}
            >
              {labels.pricing}
            </Button>
            <Button
              variant="ghost"
              size={isScrolled ? "sm" : "default"}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => scrollToSection('testimonials')}
            >
              {lang === 'ar' ? 'التقييمات' : 'Testimonials'}
            </Button>
          </div>

          {/* Actions */}
          <div className={`
            flex items-center transition-all duration-300
            ${isScrolled ? 'gap-2' : 'gap-3'}
          `}>
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size={isScrolled ? "sm" : "default"}
              className="hover:bg-primary/10 hover:text-primary transition-colors gap-1.5"
              onClick={onToggleLang}
            >
              <Globe className={isScrolled ? "w-3.5 h-3.5" : "w-4 h-4"} />
              {labels.lang}
            </Button>

            {/* WhatsApp Button */}
            <Button 
              variant="outline"
              size={isScrolled ? "sm" : "default"}
              className={`
                gap-2 border-primary/30 text-primary hover:bg-primary hover:text-white
                transition-all hover-lift hidden sm:inline-flex
                ${isScrolled ? 'px-3' : 'px-4'}
              `}
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className={isScrolled ? "w-3.5 h-3.5" : "w-4 h-4"} />
              <span className={isScrolled ? "hidden lg:inline" : ""}>
                {labels.whatsapp}
              </span>
            </Button>

            {/* Join Button */}
            <Button 
              size={isScrolled ? "sm" : "default"}
              className={`
                gap-2 bg-gradient-to-r from-primary to-primary-light 
                hover:from-primary-dark hover:to-primary
                text-white hover-lift shadow-lg hover:shadow-xl
                transition-all
                ${isScrolled ? 'px-3' : 'px-4'}
              `}
              onClick={handleFreelancerJoin}
            >
              <UserPlus className={isScrolled ? "w-3.5 h-3.5" : "w-4 h-4"} />
              <span className={isScrolled ? "hidden md:inline" : ""}>
                {labels.become}
              </span>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavbarEnhanced;
