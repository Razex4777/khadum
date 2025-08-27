import { MessageCircle, Search, Handshake } from 'lucide-react';

interface HowItWorksProps { lang: 'ar' | 'en'; }

const HowItWorks = ({ lang }: HowItWorksProps) => {
  const t = {
    ar: {
      title: 'كيف يعمل؟',
      steps: [
        { icon: MessageCircle, title: 'ابدأ محادثة', desc: 'أرسل طلبك عبر واتساب وسيستقبله النظام.' },
        { icon: Search, title: 'مطابقة فورية', desc: 'نقترح أفضل المستقلين بناءً على خبرتهم وتقييماتهم.' },
        { icon: Handshake, title: 'اتفاق ودفع آمن', desc: 'أكمل الصفقة بدفع محمي وإنهاء سلس.' },
      ],
    },
    en: {
      title: 'How it works',
      steps: [
        { icon: MessageCircle, title: 'Start a Chat', desc: 'Send your request via WhatsApp.' },
        { icon: Search, title: 'Instant Matching', desc: 'We suggest the best freelancers for you.' },
        { icon: Handshake, title: 'Deal & Secure Pay', desc: 'Complete with protected payment and smooth flow.' },
      ],
    },
  }[lang];

  return (
    <section className="container py-16">
      <h2 className="text-2xl font-bold mb-8">{t.title}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {t.steps.map(({ icon: Icon, title, desc }, i) => (
          <div key={i} className="rounded-lg border border-border/60 bg-card/60 p-6 hover-glow">
            <div className="h-10 w-10 rounded-md flex items-center justify-center bg-secondary/60 border border-border/60 mb-3">
              <Icon className="text-primary" />
            </div>
            <div className="font-semibold mb-1">{title}</div>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
