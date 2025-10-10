import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const FAQSection = () => {
  const faqs = [
    {
      q: 'كيف أبدأ مع خدوم؟',
      a: 'ببساطة اضغط على زر "ابدأ الآن" وسجل حسابك عبر واتساب. ستحصل على إرشادات كاملة خطوة بخطوة للبدء في استخدام المنصة سواء كنت عميلاً أو مستقلاً.'
    },
    {
      q: 'هل الدفع آمن؟',
      a: 'نعم تماماً. نوفر نظام دفع آمن ومضمون يحمي حقوق الطرفين. المبلغ يبقى محفوظاً بأمان حتى استلام العمل والموافقة عليه من قبل العميل.'
    },
    {
      q: 'ما هي العمولة على المشاريع؟',
      a: 'العمولة تختلف حسب الخطة المختارة. الخطة المجانية 15%، الخطة الاحترافية 10%، وخطة المؤسسات 5%. العملاء يستخدمون المنصة مجاناً بدون أي رسوم.'
    },
    {
      q: 'كيف يعمل بوت واتساب؟',
      a: 'بوت واتساب الذكي يسهل التواصل بين العملاء والمستقلين. يمكنك إرسال طلبك والحصول على ردود فورية، اختيار المستقل المناسب، ومتابعة المشروع - كل ذلك عبر واتساب.'
    },
    {
      q: 'كم يستغرق إيجاد مستقل مناسب؟',
      a: 'عادةً خلال 24 ساعة. نظامنا الذكي يستخدم الذكاء الاصطناعي للمطابقة السريعة بين المشاريع والمستقلين المناسبين بناءً على المهارات والخبرة والتقييمات.'
    },
    {
      q: 'هل يمكنني استرداد أموالي؟',
      a: 'نعم، لدينا سياسة استرداد واضحة. إذا لم يتم تسليم العمل حسب المتفق عليه، يمكنك طلب استرداد كامل للمبلغ. نحن نضمن حقوقك.'
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e910_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e910_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side - Header */}
          <motion.div 
            className="lg:sticky lg:top-32 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                <HelpCircle className="w-4 h-4" />
                الأسئلة الشائعة
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
                هل لديك أسئلة؟
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                نجيب على أكثر الأسئلة شيوعاً لمساعدتك في البدء مع خدوم
              </p>
            </div>

            {/* Illustration/CTA Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">
                  لم تجد إجابتك؟
                </h3>
                <p className="text-muted-foreground">
                  فريق الدعم جاهز لمساعدتك على مدار الساعة
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
                  onClick={() => {
                    const phoneNumber = '+966509811981';
                    const message = encodeURIComponent('مرحبا، لدي سؤال عن خدوم');
                    window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`, '_blank');
                  }}
                >
                  <MessageCircle className="w-4 h-4 ml-2" />
                  تواصل معنا الآن
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Right Side - FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden bg-white"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline text-right font-bold text-foreground hover:text-primary transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
