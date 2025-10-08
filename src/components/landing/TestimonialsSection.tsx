import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const t = {
      title: "ماذا يقول عملاؤنا",
      subtitle: "آراء حقيقية من مستقلين وعملاء استخدموا خدوم",
      testimonials: [
        {
          name: "أحمد المطيري",
          role: "مطور ويب",
          avatar: "/avatars/ahmad.jpg",
          rating: 5,
          text: "خدوم غيرت طريقة عملي كمستقل. الآن أحصل على مشاريع بشكل يومي والدفع آمن تماماً. أنصح بها بشدة!",
        },
        {
          name: "سارة الأحمدي",
          role: "مصممة جرافيك",
          avatar: "/avatars/sara.jpg",
          rating: 5,
          text: "منصة رائعة! التواصل عبر واتساب سهل جداً والمشاريع متنوعة. حققت أرباح ممتازة في أول شهر.",
        },
        {
          name: "محمد العتيبي",
          role: "صاحب شركة تقنية",
          avatar: "/avatars/mohammed.jpg",
          rating: 5,
          text: "وجدت مطور ممتاز لمشروعي في أقل من 24 ساعة. الخدمة احترافية والمستقلين ذوي كفاءة عالية.",
        },
        {
          name: "فاطمة السهلي",
          role: "كاتبة محتوى",
          avatar: "/avatars/fatima.jpg",
          rating: 5,
          text: "أفضل منصة عربية للمستقلين. الدعم ممتاز والعمولة معقولة جداً مقارنة بالمنصات الأخرى.",
        },
        {
          name: "خالد البلوشي",
          role: "مدير تسويق",
          avatar: "/avatars/khaled.jpg",
          rating: 5,
          text: "استخدمت خدوم لتوظيف فريق تسويق كامل. النتائج فاقت التوقعات والتعامل كان سلس جداً.",
        },
        {
          name: "نورة القحطاني",
          role: "مصورة فوتوغرافية",
          avatar: "/avatars/noura.jpg",
          rating: 5,
          text: "المنصة سهلة الاستخدام وأحصل على مشاريع بشكل مستمر. الدفع سريع وآمن. شكراً خدوم!",
        },
      ],
  };

  return (
    <section className="container py-16 md:py-24">
      <div className="text-center mb-12 space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold">{t.title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.testimonials.map((testimonial, i) => (
          <Card
            key={i}
            className="hover-lift hover-glow relative overflow-hidden shadow-elevated transition-all duration-300"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="absolute top-4 right-4 text-primary/10">
              <Quote className="w-12 h-12" />
            </div>
            
            <CardContent className="pt-6 pb-6 relative">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-14 h-14 border-2 border-primary/20">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                "{testimonial.text}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-60">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">500+</div>
          <div className="text-sm text-muted-foreground">
            تقييم إيجابي
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">4.9/5</div>
          <div className="text-sm text-muted-foreground">
            متوسط التقييم
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">98%</div>
          <div className="text-sm text-muted-foreground">
            نسبة الرضا
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;


