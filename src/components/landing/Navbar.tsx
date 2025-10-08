import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { MessageCircle, UserPlus } from "lucide-react";

interface NavbarProps {
  lang: 'ar' | 'en';
  onToggleLang: () => void;
}

const Navbar = ({ lang, onToggleLang }: NavbarProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const labels = {
    ar: { 
      brand: 'خدوم', 
      whatsapp: 'واتساب خدوم', 
      become: 'انضم كمستقل', 
      lang: 'EN' 
    },
    en: { 
      brand: 'Khadoom', 
      whatsapp: 'WhatsApp Bot', 
      become: 'Join as Freelancer', 
      lang: 'AR' 
    },
  }[lang];

  const handleWhatsAppClick = () => {
    // WhatsApp bot phone number - using the test number for now
    const phoneNumber = '+966509811981';
    const message = encodeURIComponent('مرحبا، أريد البدء مع خدوم');
    window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  const handleFreelancerJoin = () => {
    navigate('/authentication/register');
  };

  return (
    <header className="w-full border-b border-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <nav className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse" aria-hidden />
          <span className="font-extrabold tracking-tight text-lg">{labels.brand}</span>
          <Badge className="accent-ring hover-lift" aria-label="متاح الآن">متاح الآن</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="hover-lift hidden sm:inline-flex gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={handleWhatsAppClick}
          >
            <MessageCircle className="w-4 h-4" />
            {labels.whatsapp}
          </Button>
          <Button 
            className="hover-lift gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleFreelancerJoin}
          >
            <UserPlus className="w-4 h-4" />
            {labels.become}
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
