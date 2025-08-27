import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQSectionProps { lang: 'ar' | 'en'; }

const FAQSection = ({ lang }: FAQSectionProps) => {
  const t = {
    ar: {
      title: 'الأسئلة الشائعة',
      faqs: [
        { q: 'كيف أبدأ مع خدوم؟', a: 'اضغط على ابدأ الآن واتبِع التعليمات عبر واتساب.' },
        { q: 'هل الدفع آمن؟', a: 'نعم، نوفر قنوات دفع موثوقة مع حماية للعميل والمستقل.' },
        { q: 'هل يدعم لغات متعددة؟', a: 'نعم، نبدأ بالعربية والإنجليزية مع خطط لإضافة لغات أخرى.' },
      ],
    },
    en: {
      title: 'FAQ',
      faqs: [
        { q: 'How do I start?', a: 'Click Get Started and follow WhatsApp instructions.' },
        { q: 'Is payment secure?', a: 'Yes, trusted payment channels with protection for both sides.' },
        { q: 'Do you support multiple languages?', a: 'Yes, Arabic and English to start, with more coming.' },
      ],
    },
  }[lang];

  return (
    <section className="container py-16">
      <h2 className="text-2xl font-bold mb-8">{t.title}</h2>
      <Accordion type="single" collapsible className="w-full">
        {t.faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQSection;
