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
  useEffect(() => {
    document.title = 'خدوم — وسيطك الذكي عبر واتساب';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'خدوم: بوت واتساب يربط العملاء بالمستقلين بسرعة وأمان.');
  }, []);

  // Structured data for FAQ
  useEffect(() => {
    const scriptId = 'faq-ldjson';
    let el = document.getElementById(scriptId) as HTMLScriptElement | null;
    const items = [
        { q: 'كيف أبدأ مع خدوم؟', a: 'اضغط على ابدأ الآن واتبِع التعليمات عبر واتساب.' },
        { q: 'هل الدفع آمن؟', a: 'نعم، نوفر قنوات دفع موثوقة مع حماية للعميل والمستقل.' },
      ].map((i) => ({
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
      <NavbarEnhanced />
      <main className="overflow-hidden">
        <HeroEnhanced />
        <div id="statistics">
          <StatisticsSection />
        </div>
        <div id="features">
          <FeaturesEnhanced />
        </div>
        <HowItWorksEnhanced />
        <div id="pricing">
          <PricingSection />
        </div>
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        <PartnersSection />
        <FeaturedGrid />
        <FAQSection />
        <CTASection />
      </main>
      <FooterEnhanced />
    </div>
  );
};

export default Index;
