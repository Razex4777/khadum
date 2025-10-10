import { Card } from "@/components/ui/card";
import { Building2, Briefcase, Code, Palette, TrendingUp, Users, FileText, Camera } from "lucide-react";
import { motion } from "framer-motion";

const PartnersSection = () => {
  const partners = [
    { name: "شركة التقنية الذكية", icon: Building2, category: "تقنية" },
    { name: "وكالة التسويق الرقمي", icon: TrendingUp, category: "تسويق" },
    { name: "ستوديو التصميم الإبداعي", icon: Palette, category: "تصميم" },
    { name: "مجموعة المشاريع", icon: Briefcase, category: "أعمال" },
    { name: "شركة البرمجيات", icon: Code, category: "برمجة" },
    { name: "مكتب الاستشارات", icon: Users, category: "استشارات" },
    { name: "دار النشر الرقمية", icon: FileText, category: "محتوى" },
    { name: "ستوديو الإنتاج", icon: Camera, category: "إنتاج" }
  ];

  const stats = [
    { number: "200+", label: "شركة شريكة", color: "from-blue-600 to-cyan-600" },
    { number: "500+", label: "عميل راضي", color: "from-purple-600 to-indigo-600" },
    { number: "15+", label: "مجال عمل", color: "from-amber-600 to-orange-600" }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            <Building2 className="w-4 h-4" />
            موثوق به من قبل 500+ عميل
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            شركاء النجاح
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            انضم إلى مئات الشركات والعلامات التجارية التي تثق في خدوم
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {partners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 bg-white border-0 shadow-md cursor-pointer">
                  <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[140px]">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/30 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-gray-600 group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-300">
                        {partner.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {partner.category}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Stats */}
        <motion.div 
          className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300">
              <div className="p-6 text-center space-y-2">
                <div className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block`}>
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
