import { Card } from "@/components/ui/card";
import { Shield, Zap, Bot, CreditCard, Clock, Users, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const FeaturesEnhanced = () => {
  const mainFeatures = [
    {
      icon: Bot,
      title: "بوت واتساب ذكي",
      description: "تواصل مباشر وفوري مع المستقلين عبر واتساب بدون الحاجة لتطبيقات إضافية. احصل على ردود فورية وخدمة متاحة 24/7",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      image: "/landing/images/whatsapp-feature.png"
    },
    {
      icon: Shield,
      title: "دفع آمن ومضمون",
      description: "نظام دفع متقدم يحمي حقوق العميل والمستقل. المبلغ محفوظ بأمان حتى استلام العمل والموافقة عليه",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      image: "/landing/images/secure-payment.png"
    },
    {
      icon: Zap,
      title: "مطابقة ذكية",
      description: "خوارزميات ذكاء اصطناعي متقدمة تربطك بأنسب المستقلين حسب مهاراتهم، تقييماتهم، وخبراتهم السابقة",
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      image: "/landing/images/ai-matching.png"
    }
  ];

  const additionalFeatures = [
    {
      icon: CreditCard,
      title: "عمولات منخفضة",
      description: "عمولات تنافسية تبدأ من 5% فقط",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      icon: Clock,
      title: "توفير الوقت",
      description: "اعثر على المستقل المناسب في دقائق",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      icon: Users,
      title: "دعم متواصل",
      description: "فريق دعم متاح على مدار الساعة",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      icon: Sparkles,
      title: "تجربة مميزة",
      description: "واجهة سهلة وعملية بسيطة وواضحة",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(139,92,246,0.05)_0%,transparent_50%)] pointer-events-none" />
      
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
            لماذا تختار خدوم؟
          </h2>
          <p className="text-lg text-muted-foreground">
            منصة متكاملة توفر لك كل ما تحتاجه للعثور على أفضل المستقلين وإنجاز مشاريعك بنجاح
          </p>
        </motion.div>

        {/* Main Features - Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={index === 0 ? "md:col-span-2 lg:col-span-1" : ""}
              >
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white">
                  {/* Feature Image */}
                  {feature.image && (
                    <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  
                  <div className="p-8 space-y-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Visual Element */}
                    <div className={`h-1 w-20 rounded-full bg-gradient-to-r ${feature.color}`} />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 group bg-white">
                  <div className="p-6 space-y-4">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Why Choose Us Section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 via-white to-secondary/5">
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="text-3xl font-extrabold">
                    مع خدوم، كل شيء أسهل
                  </h3>
                  <div className="space-y-4">
                    {[
                      "تواصل مباشر عبر واتساب بدون تطبيقات إضافية",
                      "حماية كاملة للأموال حتى استلام العمل",
                      "مستقلون محترفون معتمدون بتقييمات حقيقية",
                      "دعم فني متاح على مدار الساعة"
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-foreground font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative hidden md:block">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-3xl" />
                  <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
                    <div className="space-y-4">
                      <div className="h-3 bg-gradient-to-r from-primary to-primary-light rounded-full w-3/4" />
                      <div className="h-3 bg-gradient-to-r from-secondary to-secondary-light rounded-full w-full" />
                      <div className="h-3 bg-gradient-to-r from-accent to-accent-orange rounded-full w-2/3" />
                      <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="h-20 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200" />
                        <div className="h-20 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200" />
                        <div className="h-20 rounded-xl bg-gradient-to-br from-green-100 to-green-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesEnhanced;
