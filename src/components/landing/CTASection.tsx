import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CTASectionProps { lang: 'ar' | 'en'; }

const CTASection = ({ lang }: CTASectionProps) => {
  const navigate = useNavigate();
  
  const t = {
    ar: { title: 'جاهز للبدء؟', sub: 'انطلق الآن عبر واتساب وابدأ مشروعك بأمان.', cta: 'ابدأ الآن' },
    en: { title: 'Ready to start?', sub: 'Kick off via WhatsApp and launch your project safely.', cta: 'Get Started' },
  }[lang];

  return (
    <section className="container py-20 text-center">
      <h2 className="text-3xl font-extrabold neon-text mb-3">{t.title}</h2>
      <p className="text-muted-foreground mb-6">{t.sub}</p>
      <Button 
        variant="glow" 
        className="hover-glow"
        onClick={() => navigate('/authentication/register')}
      >
        {t.cta}
      </Button>
    </section>
  );
};

export default CTASection;
