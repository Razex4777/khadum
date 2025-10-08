import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PricingSectionProps { lang: 'ar' | 'en'; }

const PricingSection = ({ lang }: PricingSectionProps) => {
  const navigate = useNavigate();

  const t = {
    ar: {
      title: "خطط تناسب احتياجاتك",
      subtitle: "اختر الخطة المناسبة لك وابدأ رحلتك مع خدوم",
      monthly: "شهريًا",
      popular: "الأكثر شعبية",
      getStarted: "ابدأ الآن",
      currentPlan: "الخطة الحالية",
      features: "الميزات",
      sar: "ر.س",
      plans: [
        {
          name: "مجاني",
          icon: Star,
          price: 0,
          description: "مثالي للبدء والتعرف على المنصة",
          badge: null,
          features: [
            { text: "عرض حتى 3 مشاريع شهريًا", included: true },
            { text: "عمولة 15% على المشاريع", included: true },
            { text: "دعم عبر البريد الإلكتروني", included: true },
            { text: "ملف شخصي أساسي", included: true },
            { text: "إشعارات واتساب محدودة", included: true },
            { text: "الأولوية في نتائج البحث", included: false },
            { text: "دعم مباشر 24/7", included: false },
            { text: "شارة التحقق", included: false },
          ],
          buttonVariant: "outline" as const,
          highlighted: false,
        },
        {
          name: "احترافي",
          icon: Zap,
          price: "TBA",
          description: "للمستقلين الجادين في تنمية أعمالهم",
          badge: "قريباً",
          features: [
            { text: "مشاريع غير محدودة", included: true },
            { text: "عمولة 10% على المشاريع", included: true },
            { text: "دعم مباشر عبر واتساب", included: true },
            { text: "ملف شخصي متقدم", included: true },
            { text: "إشعارات فورية لكل المشاريع", included: true },
            { text: "الأولوية في نتائج البحث", included: true },
            { text: "تحليلات أداء مفصلة", included: true },
            { text: "شارة التحقق", included: false },
          ],
          buttonVariant: "default" as const,
          highlighted: true,
        },
        {
          name: "مؤسسة",
          icon: Crown,
          price: "TBA",
          description: "للشركات والوكالات الكبيرة",
          badge: "قريباً",
          features: [
            { text: "كل ميزات الخطة الاحترافية", included: true },
            { text: "عمولة 5% على المشاريع", included: true },
            { text: "مدير حساب مخصص", included: true },
            { text: "حسابات فريق متعددة", included: true },
            { text: "دعم مباشر 24/7 على مدار الأسبوع", included: true },
            { text: "الأولوية القصوى في البحث", included: true },
            { text: "تقارير وتحليلات متقدمة", included: true },
            { text: "شارة التحقق الذهبية", included: true },
          ],
          buttonVariant: "default" as const,
          highlighted: false,
        },
      ],
    },
    en: {
      title: "Plans That Fit Your Needs",
      subtitle: "Choose the perfect plan for you and start your journey with Khadoom",
      monthly: "per month",
      popular: "Most Popular",
      getStarted: "Get Started",
      currentPlan: "Current Plan",
      features: "Features",
      sar: "SAR",
      plans: [
        {
          name: "Free",
          icon: Star,
          price: 0,
          description: "Perfect for getting started",
          badge: null,
          features: [
            { text: "Apply to 3 projects per month", included: true },
            { text: "15% commission on projects", included: true },
            { text: "Email support", included: true },
            { text: "Basic profile", included: true },
            { text: "Limited WhatsApp notifications", included: true },
            { text: "Priority in search results", included: false },
            { text: "24/7 live support", included: false },
            { text: "Verification badge", included: false },
          ],
          buttonVariant: "outline" as const,
          highlighted: false,
        },
        {
          name: "Professional",
          icon: Zap,
          price: "TBA",
          description: "For serious freelancers growing their business",
          badge: "Coming Soon",
          features: [
            { text: "Unlimited projects", included: true },
            { text: "10% commission on projects", included: true },
            { text: "WhatsApp live support", included: true },
            { text: "Advanced profile", included: true },
            { text: "Instant notifications for all projects", included: true },
            { text: "Priority in search results", included: true },
            { text: "Detailed performance analytics", included: true },
            { text: "Verification badge", included: false },
          ],
          buttonVariant: "default" as const,
          highlighted: true,
        },
        {
          name: "Enterprise",
          icon: Crown,
          price: "TBA",
          description: "For large companies and agencies",
          badge: "Coming Soon",
          features: [
            { text: "All Professional features", included: true },
            { text: "5% commission on projects", included: true },
            { text: "Dedicated account manager", included: true },
            { text: "Multiple team accounts", included: true },
            { text: "24/7 live support", included: true },
            { text: "Highest priority in search", included: true },
            { text: "Advanced reports & analytics", included: true },
            { text: "Gold verification badge", included: true },
          ],
          buttonVariant: "default" as const,
          highlighted: false,
        },
      ],
    },
  }[lang];

  return (
    <section className="container py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="text-center mb-12 space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold">{t.title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {t.plans.map((plan, i) => {
          const Icon = plan.icon;
          return (
            <Card
              key={i}
              className={`relative overflow-hidden transition-all duration-300 ${
                plan.highlighted
                  ? 'border-primary border-2 shadow-2xl scale-105 hover:scale-110'
                  : 'hover-lift shadow-elevated hover:shadow-floating'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  {plan.badge}
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <div className={`w-16 h-16 rounded-2xl ${
                  plan.highlighted ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                } flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-extrabold">{plan.price}</span>
                    {plan.price !== "TBA" && <span className="text-muted-foreground">{t.sar}</span>}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {plan.price === "TBA" 
                      ? (lang === 'ar' ? 'قريباً' : 'Coming Soon')
                      : t.monthly
                    }
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className={`mt-0.5 ${feature.included ? 'text-primary' : 'text-muted-foreground/50'}`}>
                        {feature.included ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground/70 line-through'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full hover-lift"
                  variant={plan.buttonVariant}
                  size="lg"
                  onClick={() => navigate('/authentication/register')}
                >
                  {t.getStarted}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Commission Info */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          {lang === 'ar' 
            ? '* تطبق الأسعار على المستقلين فقط. العملاء يستخدمون المنصة مجانًا'
            : '* Prices apply to freelancers only. Clients use the platform for free'
          }
        </p>
      </div>
    </section>
  );
};

export default PricingSection;


