import { ShieldCheck, Bot, CreditCard, Languages } from 'lucide-react';

interface FeaturesProps { lang: 'ar' | 'en'; }

const Features = ({ lang }: FeaturesProps) => {
  const t = {
    ar: {
      title: 'المميزات',
      items: [
        { icon: ShieldCheck, title: 'أمان وتشفير', desc: 'حماية محادثاتك ومعاملاتك بمعايير عالية.' },
        { icon: Bot, title: 'سهولة الاستخدام', desc: 'تجربة سلسة عبر واتساب دون تعقيد.' },
        { icon: CreditCard, title: 'دفع آمن', desc: 'حوالات موثوقة وتسوية سريعة.' },
        { icon: Languages, title: 'دعم متعدد اللغات', desc: 'العربية والإنجليزية ولغات أخرى قريبًا.' },
      ],
    },
    en: {
      title: 'Features',
      items: [
        { icon: ShieldCheck, title: 'Security & Encryption', desc: 'Protecting chats and transactions with high standards.' },
        { icon: Bot, title: 'Ease of Use', desc: 'A smooth WhatsApp experience without friction.' },
        { icon: CreditCard, title: 'Secure Payments', desc: 'Trusted transfers and fast settlement.' },
        { icon: Languages, title: 'Multi-language', desc: 'Arabic, English and more coming soon.' },
      ],
    },
  }[lang];

  return (
    <section className="container py-16">
      <h2 className="text-2xl font-bold mb-8">{t.title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {t.items.map(({ icon: Icon, title, desc }, i) => (
          <div key={i} className="rounded-lg border border-border/60 bg-card/60 p-5 hover-glow">
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

export default Features;
