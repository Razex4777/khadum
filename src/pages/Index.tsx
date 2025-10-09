import { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import NavbarEnhanced from '@/components/landing/NavbarEnhanced';
import HeroEnhanced from '@/components/landing/HeroEnhanced';
import StatisticsSection from '@/components/landing/StatisticsSection';
import FeaturesEnhanced from '@/components/landing/FeaturesEnhanced';
import HowItWorksEnhanced from '@/components/landing/HowItWorksEnhanced';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PartnersSection from '@/components/landing/PartnersSection';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/landing/Footer';

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
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.2], [0.6, 1]);

  // Scroll reveal animation configuration
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="font-tajawal">
      <NavbarEnhanced />
      <main className="overflow-hidden">
        <HeroEnhanced />
        
        <motion.div 
          id="statistics"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <StatisticsSection />
        </motion.div>

        <motion.div 
          id="features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={scaleIn}
        >
          <FeaturesEnhanced />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <HowItWorksEnhanced />
        </motion.div>

        <motion.div 
          id="pricing"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={scaleIn}
        >
          <PricingSection />
        </motion.div>

        <motion.div 
          id="testimonials"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <TestimonialsSection />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleIn}
        >
          <PartnersSection />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleIn}
        >
          <FAQSection />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
