import { Card } from "@/components/ui/card";
import { MessageCircle, Search, UserCheck, Handshake, CreditCard, Star } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorksEnhanced = () => {
  const clientSteps = [
    {
      step: "1",
      icon: MessageCircle,
      title: "ابدأ محادثة",
      description: "أرسل طلبك عبر واتساب مع تفاصيل المشروع",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      image: "/landing/images/step-1-conversation.png"
    },
    {
      step: "2",
      icon: Search,
      title: "مطابقة ذكية",
      description: "الذكاء الاصطناعي يبحث عن أفضل المستقلين",
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      image: "/landing/images/step-2-search.png"
    },
    {
      step: "3",
      icon: UserCheck,
      title: "اختر المستقل",
      description: "راجع الملفات الشخصية واختر الأنسب",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      image: "/landing/images/step-3-selection.png"
    },
    {
      step: "4",
      icon: Handshake,
      title: "اتفق على التفاصيل",
      description: "ناقش التفاصيل والسعر مع المستقل",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      image: "/landing/images/step-4-handshake.png"
    },
    {
      step: "5",
      icon: CreditCard,
      title: "دفع آمن",
      description: "المبلغ محمي حتى استلام العمل",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      image: "/landing/images/step-5-payment.png"
    },
    {
      step: "6",
      icon: Star,
      title: "تقييم ومراجعة",
      description: "قيّم المستقل لمساعدة الآخرين",
      color: "from-yellow-500 to-amber-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      image: "/landing/images/step-6-rating.png"
    }
  ];

  const freelancerSteps = [
    {
      step: "1",
      icon: UserCheck,
      title: "سجل مجانًا",
      description: "أنشئ ملفك الشخصي وأضف مهاراتك",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      step: "2",
      icon: MessageCircle,
      title: "استقبل الطلبات",
      description: "احصل على إشعارات فورية للمشاريع",
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      step: "3",
      icon: Search,
      title: "قدم عرضك",
      description: "أرسل عرض سعر احترافي مع أمثلة",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      step: "4",
      icon: Handshake,
      title: "ابدأ العمل",
      description: "بعد القبول، ابدأ العمل حسب الاتفاق",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      step: "5",
      icon: CreditCard,
      title: "استلم الدفع",
      description: "احصل على أموالك فورًا بعد التسليم",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600"
    },
    {
      step: "6",
      icon: Star,
      title: "بناء السمعة",
      description: "احصل على تقييمات إيجابية",
      color: "from-yellow-500 to-amber-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    }
  ];

  const TimelineSection = ({ title, steps }: { title: string, steps: typeof clientSteps }) => (
    <div className="space-y-8">
      <h3 className="text-2xl md:text-3xl font-bold text-center">{title}</h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white relative overflow-hidden">
                {/* Step Number Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-lg shadow-lg`}>
                    {step.step}
                  </div>
                </div>

                {/* Step Image */}
                {'image' in step && step.image && (
                  <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${step.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-foreground">
                      {step.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Decorative Line */}
                  <div className={`mt-6 h-1 w-16 rounded-full bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf610_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf610_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      
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
            كيف يعمل خدوم؟
          </h2>
          <p className="text-lg text-muted-foreground">
            عملية بسيطة وسريعة في 6 خطوات فقط لكل من العملاء والمستقلين
          </p>
        </motion.div>

        {/* Clients Timeline */}
        <TimelineSection title="للعملاء" steps={clientSteps} />

        {/* Divider */}
        <div className="my-20 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-white px-6 py-2 rounded-full border border-gray-200 shadow-sm">
              <span className="text-sm font-semibold text-muted-foreground">و</span>
            </div>
          </div>
        </div>

        {/* Freelancers Timeline */}
        <TimelineSection title="للمستقلين" steps={freelancerSteps} />

        {/* CTA Section */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 inline-block">
            <div className="p-8">
              <p className="text-lg font-semibold text-foreground mb-2">
                جاهز للبدء؟
              </p>
              <p className="text-muted-foreground">
                انضم إلى آلاف المستقلين والعملاء على منصة خدوم اليوم
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksEnhanced;
