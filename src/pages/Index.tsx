import { useEffect, useState } from 'react';
import NavbarEnhanced from '@/components/landing/NavbarEnhanced';
import HeroEnhanced from '@/components/landing/HeroEnhanced';
import StatisticsSection from '@/components/landing/StatisticsSection';
import FeaturesEnhanced from '@/components/landing/FeaturesEnhanced';
import HowItWorksEnhanced from '@/components/landing/HowItWorksEnhanced';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PartnersSection from '@/components/landing/PartnersSection';
import FeaturedGrid from '@/components/landing/FeaturedGrid';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import FooterEnhanced from '@/components/landing/FooterEnhanced';

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
      <NavbarEnhanced lang={lang} onToggleLang={() => setLang((l) => (l === 'ar' ? 'en' : 'ar'))} />
      <main className="overflow-hidden">
        <HeroEnhanced lang={lang} />
        <div id="statistics">
          <StatisticsSection lang={lang} />
        </div>
        <div id="features">
          <FeaturesEnhanced lang={lang} />
        </div>
        <HowItWorksEnhanced lang={lang} />
        <div id="pricing">
          <PricingSection lang={lang} />
        </div>
        <div id="testimonials">
          <TestimonialsSection lang={lang} />
        </div>
        <PartnersSection lang={lang} />
        <FeaturedGrid lang={lang} />
        <FAQSection lang={lang} />
        <CTASection lang={lang} />
      </main>
      <FooterEnhanced />
    </div>
  );
};

export default Index;
