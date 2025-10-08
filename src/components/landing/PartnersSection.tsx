import { Card } from "@/components/ui/card";
import { Building2, Briefcase, Code, Palette, TrendingUp, Users, FileText, Camera } from "lucide-react";

const PartnersSection = () => {
  const t = {
    ar: {
      title: "شركاء النجاح",
      subtitle: "انضم إلى مئات الشركات والعلامات التجارية التي تثق في خدوم",
      partners: [
        { name: "شركة التقنية الذكية", icon: Building2, category: "تقنية" },
        { name: "وكالة التسويق الرقمي", icon: TrendingUp, category: "تسويق" },
        { name: "ستوديو التصميم الإبداعي", icon: Palette, category: "تصميم" },
        { name: "مجموعة المشاريع", icon: Briefcase, category: "أعمال" },
        { name: "شركة البرمجيات", icon: Code, category: "برمجة" },
        { name: "مكتب الاستشارات", icon: Users, category: "استشارات" },
        { name: "دار النشر الرقمية", icon: FileText, category: "محتوى" },
        { name: "ستوديو الإنتاج", icon: Camera, category: "إنتاج" },
      ],
      trustedBy: "موثوق به من قبل",
      clients: "500+ عميل",
    },
    en: {
      title: "Success Partners",
      subtitle: "Join hundreds of companies and brands that trust Khadoom",
      partners: [
        { name: "Smart Tech Company", icon: Building2, category: "Technology" },
        { name: "Digital Marketing Agency", icon: TrendingUp, category: "Marketing" },
        { name: "Creative Design Studio", icon: Palette, category: "Design" },
        { name: "Projects Group", icon: Briefcase, category: "Business" },
        { name: "Software Company", icon: Code, category: "Development" },
        { name: "Consulting Office", icon: Users, category: "Consulting" },
        { name: "Digital Publishing House", icon: FileText, category: "Content" },
        { name: "Production Studio", icon: Camera, category: "Production" },
      ],
      trustedBy: "Trusted by",
      clients: "500+ Clients",
    },
  }[lang];

  return (
    <section className="container py-16 md:py-20 bg-muted/30">
      <div className="text-center mb-12 space-y-3">
        <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
          {t.trustedBy} {t.clients}
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold">{t.title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      {/* Logo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {t.partners.map((partner, i) => {
          const Icon = partner.icon;
          return (
            <Card
              key={i}
              className="group hover-lift hover:shadow-lg transition-all duration-300 bg-background/80 backdrop-blur-sm border-border/60"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[140px]">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {partner.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {partner.category}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Additional Trust Indicators */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-12 opacity-60">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">200+</div>
            <div className="text-sm text-muted-foreground">
              {lang === 'ar' ? 'شركة' : 'Companies'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">500+</div>
            <div className="text-sm text-muted-foreground">
              {lang === 'ar' ? 'عميل راضي' : 'Happy Clients'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">15+</div>
            <div className="text-sm text-muted-foreground">
              {lang === 'ar' ? 'مجال' : 'Industries'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;


