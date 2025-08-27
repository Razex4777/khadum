import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, UserPlus } from "lucide-react";

interface HeroProps { lang: 'ar' | 'en'; }

const Counter = ({ to, duration = 1200 }: { to: number; duration?: number }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setValue(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [to, duration]);
  return <span>{value.toLocaleString()}</span>;
};

const Hero = ({ lang }: HeroProps) => {
  const navigate = useNavigate();
  
  const t = {
    ar: {
      title: "خدوم — منصة المستقلين الذكية",
      subtitle: "بوت واتساب يربط المستقلين بالعملاء بسرعة وأمان مع دفع موثوق ودعم ذكي.",
      cta1: "انضم كمستقل",
      cta2: "ابدأ مع واتساب",
      stats: [
        { label: "طلبات شهرية", value: 12400 },
        { label: "مستقلون نشطون", value: 870 },
        { label: "أرباح المستقلين", value: 92000, suffix: " ر.س" },
      ],
    },
    en: {
      title: "Khadoom — Smart Freelancer Platform",
      subtitle: "WhatsApp bot connecting freelancers with clients fast and securely, with trusted payments.",
      cta1: "Join as Freelancer",
      cta2: "Start with WhatsApp",
      stats: [
        { label: "Monthly Requests", value: 12400 },
        { label: "Active Freelancers", value: 870 },
        { label: "Freelancer Earnings", value: 92000, suffix: " SAR" },
      ],
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

  return (
    <section className="relative overflow-hidden">
      <div className="container py-16 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.15] accent-text">
              {t.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-prose">
              {t.subtitle}
            </p>
            <div className="flex gap-3">
              <Button 
                className="hover-lift gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleFreelancerJoin}
              >
                <UserPlus className="w-4 h-4" />
                {t.cta1}
              </Button>
              <Button 
                variant="outline" 
                className="hover-lift gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="w-4 h-4" />
                {t.cta2}
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 blur-3xl opacity-60" aria-hidden />
            <div className="grid grid-cols-3 gap-4">
              {t.stats.map((s, i) => (
                <Card key={i} className="accent-ring hover-lift bg-card/90 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-extrabold text-primary">
                      <Counter to={s.value} />{s.suffix || ''}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

