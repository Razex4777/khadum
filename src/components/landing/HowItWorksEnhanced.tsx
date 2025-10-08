import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Search, UserCheck, Handshake, CreditCard, Star, ArrowRight } from "lucide-react";

const HowItWorksEnhanced = () => {
  const t = {
      title: "كيف يعمل خدوم؟",
      subtitle: "عملية بسيطة وسريعة في 6 خطوات فقط",
      forClients: "للعملاء",
      forFreelancers: "للمستقلين",
      clientSteps: [
        {
          icon: MessageCircle,
          title: "ابدأ محادثة",
          description: "أرسل طلبك عبر واتساب مع تفاصيل المشروع",
          badge: "الخطوة 1",
          color: "text-blue-600",
          bgColor: "bg-blue-600/10",
        },
        {
          icon: Search,
          title: "مطابقة ذكية",
          description: "الذكاء الاصطناعي يبحث عن أفضل المستقلين المناسبين",
          badge: "الخطوة 2",
          color: "text-purple-600",
          bgColor: "bg-purple-600/10",
        },
        {
          icon: UserCheck,
          title: "اختر المستقل",
          description: "راجع الملفات الشخصية والتقييمات واختر الأنسب",
          badge: "الخطوة 3",
          color: "text-emerald-600",
          bgColor: "bg-emerald-600/10",
        },
        {
          icon: Handshake,
          title: "اتفق على التفاصيل",
          description: "ناقش التفاصيل والتسليمات والسعر مع المستقل",
          badge: "الخطوة 4",
          color: "text-amber-600",
          bgColor: "bg-amber-600/10",
        },
        {
          icon: CreditCard,
          title: "دفع آمن",
          description: "ادفع بأمان والمبلغ محمي حتى استلام العمل",
          badge: "الخطوة 5",
          color: "text-primary",
          bgColor: "bg-primary/10",
        },
        {
          icon: Star,
          title: "تقييم ومراجعة",
          description: "استلم العمل وقيّم المستقل لمساعدة الآخرين",
          badge: "الخطوة 6",
          color: "text-orange-600",
          bgColor: "bg-orange-600/10",
        },
      ],
      freelancerSteps: [
        {
          icon: UserCheck,
          title: "سجل مجانًا",
          description: "أنشئ ملفك الشخصي وأضف مهاراتك وأعمالك السابقة",
          badge: "الخطوة 1",
          color: "text-blue-600",
          bgColor: "bg-blue-600/10",
        },
        {
          icon: MessageCircle,
          title: "استقبل الطلبات",
          description: "احصل على إشعارات فورية للمشاريع المناسبة لك",
          badge: "الخطوة 2",
          color: "text-purple-600",
          bgColor: "bg-purple-600/10",
        },
        {
          icon: Search,
          title: "قدم عرضك",
          description: "أرسل عرض سعر احترافي مع أمثلة من أعمالك",
          badge: "الخطوة 3",
          color: "text-emerald-600",
          bgColor: "bg-emerald-600/10",
        },
        {
          icon: Handshake,
          title: "ابدأ العمل",
          description: "بعد القبول، ابدأ العمل حسب الاتفاق المحدد",
          badge: "الخطوة 4",
          color: "text-amber-600",
          bgColor: "bg-amber-600/10",
        },
        {
          icon: CreditCard,
          title: "استلم الدفع",
          description: "بعد التسليم والموافقة، احصل على أموالك فورًا",
          badge: "الخطوة 5",
          color: "text-primary",
          bgColor: "bg-primary/10",
        },
        {
          icon: Star,
          title: "بناء السمعة",
          description: "احصل على تقييمات إيجابية وزد فرصك المستقبلية",
          badge: "الخطوة 6",
          color: "text-orange-600",
          bgColor: "bg-orange-600/10",
        },
      ],
  };

  const renderTimeline = (steps: typeof t.clientSteps, title: string) => (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-center mb-8">{title}</h3>
      
      {/* Desktop Timeline */}
      <div className="hidden lg:block relative">
        {/* Connection Line */}
        <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
        
        <div className="grid grid-cols-6 gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Card className="hover-lift hover-glow shadow-elevated transition-all duration-300 border-2 hover:border-primary/30 h-full">
                  <CardContent className="pt-6 pb-6 text-center space-y-3">
                    <Badge className={`${step.bgColor} ${step.color} border-0`}>{step.badge}</Badge>
                    
                    <div className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center mx-auto relative z-10 border-4 border-background`}>
                      <Icon className={`w-8 h-8 ${step.color}`} />
                    </div>

                    <h4 className="font-bold text-sm">{step.title}</h4>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {i < steps.length - 1 && (
                  <div className="absolute top-16 -right-4 z-10">
                    <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile/Tablet Timeline */}
      <div className="lg:hidden space-y-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <Card
              key={i}
              className="hover-lift hover-glow shadow-elevated transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Badge className={`${step.bgColor} ${step.color} border-0 mb-2`}>{step.badge}</Badge>
                  <div className={`w-14 h-14 rounded-xl ${step.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${step.color}`} />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="container py-16 md:py-24">
      <div className="text-center mb-12 space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold">{t.title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      {/* Clients Timeline */}
      {renderTimeline(t.clientSteps, t.forClients)}

      {/* Freelancers Timeline */}
      {renderTimeline(t.freelancerSteps, t.forFreelancers)}
    </section>
  );
};

export default HowItWorksEnhanced;


