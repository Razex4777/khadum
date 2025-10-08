import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Bot, CreditCard, Languages, Zap, Lock, Bell, BarChart3, Clock, Users, Award, HeadphonesIcon } from "lucide-react";

const FeaturesEnhanced = () => {
  const t = {
      title: "مميزات تجعلنا الخيار الأفضل",
      subtitle: "نوفر لك كل ما تحتاجه لبناء عمل مستقل ناجح",
      mainFeatures: [
        {
          icon: ShieldCheck,
          title: "أمان وتشفير متقدم",
          description: "حماية محادثاتك ومعاملاتك بأعلى معايير الأمان العالمية مع تشفير من طرف إلى طرف",
          badge: "أولوية قصوى",
          color: "text-primary",
          bgColor: "bg-primary/10",
        },
        {
          icon: CreditCard,
          title: "دفع آمن ومرن",
          description: "نظام دفع موثوق متكامل مع MyFatoorah يدعم جميع بطاقات الائتمان والمحافظ الرقمية",
          badge: "موثوق",
          color: "text-emerald-600",
          bgColor: "bg-emerald-600/10",
        },
        {
          icon: Bot,
          title: "ذكاء اصطناعي متطور",
          description: "مطابقة ذكية بين العملاء والمستقلين باستخدام تقنيات الذكاء الاصطناعي من Google Gemini",
          badge: "AI مدعوم",
          color: "text-blue-600",
          bgColor: "bg-blue-600/10",
        },
      ],
      additionalFeatures: [
        { icon: Zap, title: "استجابة فورية", desc: "ردود سريعة على طلبات المشاريع خلال دقائق" },
        { icon: Lock, title: "خصوصية مضمونة", desc: "لا نشارك بياناتك مع أي طرف ثالث" },
        { icon: Bell, title: "إشعارات ذكية", desc: "احصل على تنبيهات فورية لكل مشروع جديد" },
        { icon: BarChart3, title: "تحليلات مفصلة", desc: "تتبع أدائك وأرباحك بتقارير شاملة" },
        { icon: Clock, title: "دعم 24/7", desc: "فريق دعم متاح على مدار الساعة" },
        { icon: Users, title: "مجتمع نشط", desc: "انضم لآلاف المستقلين النشطين" },
        { icon: Award, title: "شارات التميز", desc: "احصل على شارات تميز لأفضل أداء" },
        { icon: Languages, title: "متعدد اللغات", desc: "دعم كامل للعربية والإنجليزية" },
      ],
      whyChooseUs: "لماذا تختار خدوم؟",
      reasons: [
        {
          title: "سهولة الاستخدام",
          description: "واجهة بسيطة عبر واتساب لا تحتاج خبرة تقنية",
          icon: Bot,
        },
        {
          title: "عمولة منخفضة",
          description: "نسب عمولة تنافسية تبدأ من 5% فقط",
          icon: CreditCard,
        },
        {
          title: "مصداقية عالية",
          description: "نظام تقييمات شفاف وحماية لحقوق الطرفين",
          icon: ShieldCheck,
        },
      ],
  };

  return (
    <section className="py-16 md:py-24">
      {/* Main Features - Hero Style */}
      <div className="container mb-16">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold">{t.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {t.mainFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card
                key={i}
                className="relative overflow-hidden hover-card shadow-elevated group border-2 hover:border-primary/30 transition-all duration-500 cursor-pointer"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bgColor} rounded-bl-full opacity-50 group-hover:opacity-70 transition-opacity`} />
                
                <CardContent className="pt-8 pb-8 relative">
                  <Badge className="mb-4" variant="secondary">{feature.badge}</Badge>
                  
                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>

                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Additional Features - Grid */}
      <div className="container mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {t.additionalFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card
                key={i}
                className="hover-lift hover:shadow-lg transition-all duration-300 bg-card/60 backdrop-blur-sm"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <CardContent className="p-5 text-center space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground leading-snug">{feature.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Why Choose Us - Alternating Layout */}
      <div className="container">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">{t.whyChooseUs}</h3>
        
        <div className="space-y-8 max-w-4xl mx-auto">
          {t.reasons.map((reason, i) => {
            const Icon = reason.icon;
            const isEven = i % 2 === 0;
            return (
              <Card
                key={i}
                className="hover-lift hover-glow shadow-elevated overflow-hidden"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <CardContent className={`p-8 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-6`}>
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <div className={`flex-1 ${isEven ? 'text-left' : 'md:text-right'} text-center`}>
                    <h4 className="text-xl font-bold mb-2">{reason.title}</h4>
                    <p className="text-muted-foreground">{reason.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesEnhanced;


