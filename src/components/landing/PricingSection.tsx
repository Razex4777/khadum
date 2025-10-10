import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "مجاني",
      icon: Star,
      price: "0",
      period: "مجاني للأبد",
      description: "مثالي للبدء والتعرف على المنصة",
      badge: null,
      popular: false,
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      features: [
        { text: "عرض حتى 3 مشاريع شهريًا", included: true },
        { text: "عمولة 15% على المشاريع", included: true },
        { text: "دعم عبر البريد الإلكتروني", included: true },
        { text: "ملف شخصي أساسي", included: true },
        { text: "الأولوية في نتائج البحث", included: false },
        { text: "دعم مباشر 24/7", included: false },
        { text: "شارة التحقق", included: false }
      ]
    },
    {
      name: "احترافي",
      icon: Zap,
      price: "TBA",
      period: "قريباً",
      description: "للمستقلين الجادين في تنمية أعمالهم",
      badge: "الأكثر شعبية",
      popular: true,
      color: "from-primary to-primary-light",
      bgColor: "bg-primary-ultra-light",
      features: [
        { text: "مشاريع غير محدودة", included: true },
        { text: "عمولة 10% على المشاريع", included: true },
        { text: "دعم مباشر عبر واتساب", included: true },
        { text: "ملف شخصي متقدم", included: true },
        { text: "الأولوية في نتائج البحث", included: true },
        { text: "تحليلات أداء مفصلة", included: true },
        { text: "شارة التحقق", included: false }
      ]
    },
    {
      name: "مؤسسة",
      icon: Crown,
      price: "TBA",
      period: "قريباً",
      description: "للشركات والوكالات الكبيرة",
      badge: "قريباً",
      popular: false,
      color: "from-secondary to-secondary-light",
      bgColor: "bg-purple-50",
      features: [
        { text: "كل ميزات الخطة الاحترافية", included: true },
        { text: "عمولة 5% على المشاريع", included: true },
        { text: "مدير حساب مخصص", included: true },
        { text: "حسابات فريق متعددة", included: true },
        { text: "دعم مباشر 24/7 على مدار الأسبوع", included: true },
        { text: "تقارير وتحليلات متقدمة", included: true },
        { text: "شارة التحقق الذهبية", included: true }
      ]
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e908_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e908_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
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
            خطط تناسب احتياجاتك
          </h2>
          <p className="text-lg text-muted-foreground">
            اختر الخطة المناسبة لك وابدأ رحلتك مع خدوم
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={plan.popular ? "md:-mt-4" : ""}
              >
                <Card className={`h-full relative overflow-hidden border-2 ${
                  plan.popular 
                    ? 'border-primary shadow-2xl' 
                    : 'border-transparent shadow-lg hover:shadow-xl'
                } transition-all duration-300 bg-white`}>
                  
                  {/* Popular Badge */}
                  {plan.badge && (
                    <div className={`absolute top-0 right-0 left-0 ${
                      plan.popular ? 'bg-gradient-to-r from-primary to-primary-light' : 'bg-gray-600'
                    } text-white text-center py-2 px-4`}>
                      <span className="text-sm font-bold">{plan.badge}</span>
                    </div>
                  )}

                  <div className={`p-8 ${plan.badge ? 'pt-16' : ''}`}>
                    {/* Icon & Name */}
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-8 pb-8 border-b border-gray-100">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className={`text-5xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                          {plan.price}
                        </span>
                        {plan.price !== "TBA" && (
                          <span className="text-muted-foreground">ر.س</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {plan.period}
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            feature.included 
                              ? 'bg-green-100' 
                              : 'bg-gray-100'
                          }`}>
                            <Check className={`w-3 h-3 ${
                              feature.included 
                                ? 'text-green-600' 
                                : 'text-gray-400'
                            }`} />
                          </div>
                          <span className={`text-sm ${
                            feature.included 
                              ? 'text-foreground' 
                              : 'text-muted-foreground line-through'
                          }`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      className={`w-full h-12 font-bold ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary shadow-lg' 
                          : 'bg-gray-900 hover:bg-gray-800'
                      } group`}
                      onClick={() => navigate('/authentication/register')}
                    >
                      ابدأ الآن
                      <ArrowRight className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Note */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-sm text-muted-foreground">
            * تطبق الأسعار على المستقلين فقط. العملاء يستخدمون المنصة مجانًا
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
