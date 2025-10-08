import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Users, FileCheck, TrendingUp, Award, Star, Clock } from "lucide-react";


const Counter = ({ to, duration = 2000 }: { to: number; duration?: number }) => {
  const [value, setValue] = useState(0);
  
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      setValue(Math.floor(progress * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [to, duration]);
  
  return <span>{value.toLocaleString()}</span>;
};

const StatisticsSection = () => {
  const t = {
      title: "أرقام تتحدث عن نفسها",
      subtitle: "انضم إلى آلاف المستقلين والعملاء الذين يثقون في خدوم",
      stats: [
        {
          icon: FileCheck,
          label: "مشروع مكتمل",
          value: 12400,
          suffix: "+",
          color: "text-primary",
          bgColor: "bg-primary/10",
        },
        {
          icon: Users,
          label: "مستقل نشط",
          value: 870,
          suffix: "+",
          color: "text-blue-600",
          bgColor: "bg-blue-600/10",
        },
        {
          icon: TrendingUp,
          label: "إجمالي الأرباح",
          value: 920000,
          prefix: "",
          suffix: " ر.س",
          color: "text-emerald-600",
          bgColor: "bg-emerald-600/10",
        },
        {
          icon: Award,
          label: "نسبة الرضا",
          value: 98,
          suffix: "%",
          color: "text-amber-600",
          bgColor: "bg-amber-600/10",
        },
        {
          icon: Star,
          label: "تقييم المنصة",
          value: 4.9,
          suffix: "/5.0",
          color: "text-orange-600",
          bgColor: "bg-orange-600/10",
          decimals: true,
        },
        {
          icon: Clock,
          label: "متوسط وقت التوظيف",
          value: 24,
          suffix: " ساعة",
          color: "text-purple-600",
          bgColor: "bg-purple-600/10",
        },
      ],
  };

  return (
    <section className="container py-16 md:py-24">
      <div className="text-center mb-12 space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold">{t.title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {t.stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={i} 
              className="hover-lift hover-glow shadow-elevated border-2 transition-all duration-300 hover:border-primary/30"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardContent className="p-6 text-center space-y-3">
                <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center mx-auto`}>
                  <Icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className={`text-3xl md:text-4xl font-extrabold ${stat.color}`}>
                  {stat.prefix || ''}
                  {stat.decimals ? (
                    <span>{stat.value.toFixed(1)}</span>
                  ) : (
                    <Counter to={stat.value} duration={2000 + i * 200} />
                  )}
                  {stat.suffix || ''}
                </div>
                <div className="text-sm font-medium text-muted-foreground leading-tight">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default StatisticsSection;


