import { useEffect, useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturedGrid from '@/components/landing/FeaturedGrid';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

const Index = () => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    document.title = lang === 'ar' ? 'خدوم — وسيطك الذكي عبر واتساب' : 'Khadoom — Smart WhatsApp Broker';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', lang === 'ar' ? 'خدوم: بوت واتساب يربط العملاء بالمستقلين بسرعة وأمان.' : 'Khadoom: WhatsApp bot connecting clients with freelancers.');
  }, [lang]);

  // Structured data for FAQ
  useEffect(() => {
    const scriptId = 'faq-ldjson';
    let el = document.getElementById(scriptId) as HTMLScriptElement | null;
    const items = (lang === 'ar'
      ? [
          { q: 'كيف أبدأ مع خدوم؟', a: 'اضغط على ابدأ الآن واتبِع التعليمات عبر واتساب.' },
          { q: 'هل الدفع آمن؟', a: 'نعم، نوفر قنوات دفع موثوقة مع حماية للعميل والمستقل.' },
        ]
      : [
          { q: 'How do I start?', a: 'Click Get Started and follow WhatsApp instructions.' },
          { q: 'Is payment secure?', a: 'Yes, trusted payment channels with protection for both sides.' },
        ]).map((i) => ({
          '@type': 'Question',
          name: i.q,
          acceptedAnswer: { '@type': 'Answer', text: i.a },
        }));
    const json = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items,
    };
    const content = JSON.stringify(json);
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = scriptId;
      document.head.appendChild(el);
    }
    el.text = content;
    return () => {
      if (el) el.remove();
    };
  }, [lang]);

  return (
    <div className="font-tajawal">
      <Navbar lang={lang} onToggleLang={() => setLang((l) => (l === 'ar' ? 'en' : 'ar'))} />
      <main>
        <Hero lang={lang} />
        <Features lang={lang} />
        <HowItWorks lang={lang} />
        <FeaturedGrid lang={lang} />
        <FAQSection lang={lang} />
        <CTASection lang={lang} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
