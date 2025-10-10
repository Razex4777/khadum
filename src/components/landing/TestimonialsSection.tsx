import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "أحمد المطيري",
      role: "مطور ويب",
      avatar: "/avatars/ahmad.png",
      rating: 5,
      text: "خدوم غيرت طريقة عملي كمستقل. الآن أحصل على مشاريع بشكل يومي والدفع آمن تماماً. أنصح بها بشدة!",
      company: "مستقل"
    },
    {
      name: "سارة الأحمدي",
      role: "مصممة جرافيك",
      avatar: "/avatars/sara.png",
      rating: 5,
      text: "منصة رائعة! التواصل عبر واتساب سهل جداً والمشاريع متنوعة. حققت أرباح ممتازة في أول شهر.",
      company: "مصممة مستقلة"
    },
    {
      name: "محمد العتيبي",
      role: "صاحب شركة تقنية",
      avatar: "/avatars/mohammed.png",
      rating: 5,
      text: "وجدت مطور ممتاز لمشروعي في أقل من 24 ساعة. الخدمة احترافية والمستقلين ذوي كفاءة عالية.",
      company: "Tech Solutions"
    },
    {
      name: "فاطمة السهلي",
      role: "كاتبة محتوى",
      avatar: "/avatars/fatima.png",
      rating: 5,
      text: "أفضل منصة عربية للمستقلين. الدعم ممتاز والعمولة معقولة جداً مقارنة بالمنصات الأخرى.",
      company: "كاتبة مستقلة"
    },
    {
      name: "خالد البلوشي",
      role: "مدير تسويق",
      avatar: "/avatars/khaled.png",
      rating: 5,
      text: "استخدمت خدوم لتوظيف فريق تسويق كامل. النتائج فاقت التوقعات والتعامل كان سلس جداً.",
      company: "Digital Marketing Co"
    },
    {
      name: "نورة القحطاني",
      role: "مصورة فوتوغرافية",
      avatar: "/avatars/noura.png",
      rating: 5,
      text: "المنصة سهلة الاستخدام وأحصل على مشاريع بشكل مستمر. الدفع سريع وآمن. شكراً خدوم!",
      company: "مصورة مستقلة"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(14,165,233,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            ماذا يقول عملاؤنا
          </h2>
          <p className="text-lg text-muted-foreground">
            آراء حقيقية من مستقلين وعملاء استخدموا خدوم
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white relative overflow-hidden">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Quote className="w-20 h-20 text-primary" />
                </div>

                <div className="p-8 space-y-6 relative">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-foreground leading-relaxed text-base">
                    "{testimonial.text}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <Avatar className="w-14 h-14 border-2 border-primary/20">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-muted-foreground/70 truncate">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Metrics */}
        <motion.div 
          className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-white">
            <div className="p-6 text-center space-y-2">
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                تقييم إيجابي
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
            <div className="p-6 text-center space-y-2">
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-blue-400 text-blue-400" />
                ))}
                <Star className="w-5 h-5 fill-blue-400/50 text-blue-400" />
              </div>
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                4.9/5
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                متوسط التقييم
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
            <div className="p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                نسبة الرضا
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
