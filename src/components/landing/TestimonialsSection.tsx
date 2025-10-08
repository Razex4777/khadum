import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

interface TestimonialsSectionProps { lang: 'ar' | 'en'; }

const TestimonialsSection = ({ lang }: TestimonialsSectionProps) => {
  const t = {
    ar: {
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
    },
    en: {
      title: "What Our Clients Say",
      subtitle: "Real reviews from freelancers and clients who used Khadoom",
      testimonials: [
        {
          name: "Ahmed Al-Mutairi",
          role: "Web Developer",
          avatar: "/avatars/ahmad.jpg",
          rating: 5,
          text: "Khadoom changed the way I work as a freelancer. Now I get daily projects and payment is completely secure. Highly recommend!",
        },
        {
          name: "Sarah Al-Ahmadi",
          role: "Graphic Designer",
          avatar: "/avatars/sara.jpg",
          rating: 5,
          text: "Amazing platform! Communication via WhatsApp is very easy and projects are diverse. Made excellent profits in the first month.",
        },
        {
          name: "Mohammed Al-Otaibi",
          role: "Tech Company Owner",
          avatar: "/avatars/mohammed.jpg",
          rating: 5,
          text: "Found an excellent developer for my project in less than 24 hours. Professional service and highly skilled freelancers.",
        },
        {
          name: "Fatima Al-Sahli",
          role: "Content Writer",
          avatar: "/avatars/fatima.jpg",
          rating: 5,
          text: "Best Arabic platform for freelancers. Excellent support and very reasonable commission compared to other platforms.",
        },
        {
          name: "Khaled Al-Balushi",
          role: "Marketing Manager",
          avatar: "/avatars/khaled.jpg",
          rating: 5,
          text: "Used Khadoom to hire a complete marketing team. Results exceeded expectations and the process was very smooth.",
        },
        {
          name: "Noura Al-Qahtani",
          role: "Photographer",
          avatar: "/avatars/noura.jpg",
          rating: 5,
          text: "Easy to use platform and I get consistent projects. Payment is fast and secure. Thank you Khadoom!",
        },
      ],
    },
  }[lang];

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
            {lang === 'ar' ? 'تقييم إيجابي' : 'Positive Reviews'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">4.9/5</div>
          <div className="text-sm text-muted-foreground">
            {lang === 'ar' ? 'متوسط التقييم' : 'Average Rating'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">98%</div>
          <div className="text-sm text-muted-foreground">
            {lang === 'ar' ? 'نسبة الرضا' : 'Satisfaction Rate'}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;


